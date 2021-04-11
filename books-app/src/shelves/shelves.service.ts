import { Injectable, HttpException, HttpStatus, Post, UseGuards, Response, Body, Headers } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShelveEntity } from './shelves.entity';
import { AddBookToShelfDTO } from './dto/add_book_to_shelve.dto';
import { UserBookShelfEntity } from './user_book_shelf.entity';
import { ResponseMapper } from '../shared/responseMapper'
import jwt_decode from "jwt-decode";
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedShelvesResultDto } from './dto/paginated_shelves_result.dto';

@Injectable()
export class ShelvesService {
  constructor(
    @InjectRepository(ShelveEntity)
    private shelveRepository: Repository<ShelveEntity>,
    @InjectRepository(UserBookShelfEntity)
    private userBookShelfEntity: Repository<UserBookShelfEntity>,
  ) { }

  async addBookToShelf(res, data: AddBookToShelfDTO, @Headers() headers) {
    const userData = jwt_decode(headers.authorization)
    const user_id = userData['user']['id'];
    const user_book_shelf = await this.findBookInShelf(data.book_id, user_id);

    // If book is already added in any shelve ,shift the book to requested shelf
    if (user_book_shelf) {
      user_book_shelf.book_id = data.book_id;
      user_book_shelf.shelf_id = data.shelf_id;
      await user_book_shelf.save().then((result) => {
        let responseMapper = new ResponseMapper();
        let message = "";

        // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
        responseMapper.sendResponse(res, 200, {}, message, "", 204)
      }).catch(
        (error) => {
          console.log(error)
          if (error.errno == 1062) {
            let responseMapper = new ResponseMapper();
            let message = "Book is already added to this shelf";

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
        shelf_id: data.shelf_id
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
            let message = "Book is already added to this shelf";

            // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
            responseMapper.sendResponse(res, 422, {}, message, "", 200)
          }
        });
    }
  }

  async getUserShelves(res, @Headers() headers, paginationDto: PaginationDto): Promise<PaginatedShelvesResultDto> {
    const userData = jwt_decode(headers.authorization)
    const user_id = userData['user']['id'];
    let language = paginationDto.language;
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const shelves = await this.shelveRepository.createQueryBuilder("shelves")
      .innerJoinAndSelect(UserBookShelfEntity, 'user_book_shelf', 'shelves.group_id = user_book_shelf.shelf_id')
      .where('user_book_shelf.user_id = :user_id', { user_id })
      .andWhere('shelves.language = :language', { language })
      .orderBy('shelves.created_at', "ASC")
      .getMany();

    const totalCount = shelves.length;
    const data = shelves.splice(skippedItems, paginationDto.limit)
    const hasMore = (totalCount > (skippedItems + Number(paginationDto.limit)));
    const results = {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      hasMore,
      data
    }

    let responseMapper = new ResponseMapper();
    let message = "User Shelves fetch successfully";

    // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
    return responseMapper.sendResponse(res, 200, results, message, "", 200)
  }

  async getUserBooksByShelfId(res, @Headers() headers, paginationDto: PaginationDto): Promise<PaginatedShelvesResultDto> {
    const userData = jwt_decode(headers.authorization)
    const user_id = userData['user']['id'];
    let language = paginationDto.language;
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const shelves = await this.shelveRepository.createQueryBuilder("shelves")
      .innerJoinAndSelect(UserBookShelfEntity, 'user_book_shelf', 'shelves.group_id = user_book_shelf.shelf_id')
      .where('user_book_shelf.user_id = :user_id', { user_id })
      .andWhere('shelves.language = :language', { language })
      .orderBy('shelves.created_at', "ASC")
      .getMany();

    const totalCount = shelves.length;
    const data = shelves.splice(skippedItems, paginationDto.limit)
    const hasMore = (totalCount > (skippedItems + Number(paginationDto.limit)));
    const results = {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      hasMore,
      data
    }

    let responseMapper = new ResponseMapper();
    let message = "User Shelves fetch successfully";

    // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
    return responseMapper.sendResponse(res, 200, results, message, "", 200)
  }

  async findBookInShelf(book_id: string, user_id: string): Promise<UserBookShelfEntity> {
    return this.userBookShelfEntity.findOne({
      where: {
        book_id: book_id,
        user_id: user_id
      }
    });
  }
}