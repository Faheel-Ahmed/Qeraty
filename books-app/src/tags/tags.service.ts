import { Injectable, HttpException, HttpStatus, Post, UseGuards, Response, Body, Headers } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsEntity } from './tags.entity';
import { UserBookTagEntity } from './user_book_tag.entity';
import { ResponseMapper } from '../shared/responseMapper'
import jwt_decode from "jwt-decode";
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedShelvesResultDto } from './dto/paginated_shelves_result.dto';
import { CreateTagDTO } from './dto/create-tag.dto';
import { AddBookToTagDTO } from './dto/add_book_to_tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagsEntity)
    private tagsRepository: Repository<TagsEntity>,
    @InjectRepository(UserBookTagEntity)
    private userBookShelfEntity: Repository<UserBookTagEntity>,
  ) { }

  async createTag(res, data: CreateTagDTO, @Headers() headers) {
    const tags = await this.tagsRepository.create(data);
    const save=await this.tagsRepository.save({'name':data.name,"type":data.type}).then((result) => {
      let responseMapper = new ResponseMapper();
      let message = "Tag added successfully";

      // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
      responseMapper.sendResponse(res, 201, {}, message, "", 201)
    }).catch(
      (error) => {
        console.log(error)
        if (error.errno == 1062) {
          let responseMapper = new ResponseMapper();
          let message = "Tag is already added";

          // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
          responseMapper.sendResponse(res, 422, {}, message, "", 200)
        }
      });
  }

  async addBookToTag(res, data: AddBookToTagDTO, @Headers() headers) {
    const userData = jwt_decode(headers.authorization)
    const user_id = userData['user']['id'];
    const user_book_tag = await this.findBookInShelf(data.book_id, user_id);

    // If book is already added in any tag ,shift the book to requested tag
    if (user_book_tag) {
      user_book_tag.book_id = data.book_id;
      user_book_tag.tag_id = data.tag_id;
      await user_book_tag.save().then((result) => {
        let responseMapper = new ResponseMapper();
        let message = "";

        // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
        responseMapper.sendResponse(res, 200, {}, message, "", 204)
      }).catch(
        (error) => {
          console.log(error)
          if (error.errno == 1062) {
            let responseMapper = new ResponseMapper();
            let message = "Book is already added to this tag";

            // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
            responseMapper.sendResponse(res, 422, {}, message, "", 200)
          }
          if (error.errno == 1452) {
            let responseMapper = new ResponseMapper();
            let message = "Invalid Book/Tag Id";

            // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
            responseMapper.sendResponse(res, 422, {}, message, "", 200)
          }
        });
    }
    // Add Book to shelf
    else {
      let payload = {
        user_id: user_id,
        book_id: data.book_id,
        tag_id: data.tag_id
      }
      this.userBookShelfEntity.save(payload).then((result) => {
        let responseMapper = new ResponseMapper();
        let message = "";

        // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
        responseMapper.sendResponse(res, 200, {}, message, "", 204)
      }).catch(
        (error) => {
          if (error.errno == 1062) {
            let responseMapper = new ResponseMapper();
            let message = "Book is already added to this tag";

            // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
            responseMapper.sendResponse(res, 422, {}, message, "", 200)
          }
          if (error.errno == 1452) {
            let responseMapper = new ResponseMapper();
            let message = "Invalid Book/Tag Id";

            // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
            responseMapper.sendResponse(res, 422, {}, message, "", 200)
          }
        });
    }
  }

  async findBookInShelf(book_id: string, user_id: string): Promise<UserBookTagEntity> {
    return this.userBookShelfEntity.findOne({
      where: {
        book_id: book_id,
        user_id: user_id
      }
    });
  }
}