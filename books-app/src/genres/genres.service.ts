import { Injectable, HttpException, HttpStatus, Body,Param,Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseMapper } from '../shared/responseMapper'
import { CreateGenreDto } from './dto/create_genre.dto';
import { UpdateGenreDto } from './dto/update_genre.dto';
import { GenreEntity } from './genre.entity';
import { GenreApprovalEntity } from './genreApproval.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(GenreEntity)
    private genreRepository: Repository<GenreEntity>,
    @InjectRepository(GenreApprovalEntity)
    private genreApprovalEntity: Repository<GenreApprovalEntity>,
  ) { }

  async addGenre(res, data: CreateGenreDto) {
    let { genre } = data;
    var group_id = '';

    // Loop genre and add two rows in genre table
    genre.map(async (item, key) => {
      let genrePayload = {
        name: item['name'],
        description: item['description'],
        language: item['language'],
        group_id: (group_id != '' ? group_id : '0')
      }

      await this.genreRepository.save(genrePayload).then(async (result) => {
        if (group_id == '') {
          group_id = result.id;
        }

        // Update group_id in records
        let genreEnglishRecord = await this.findGenreById(result.id);
        genreEnglishRecord.group_id = group_id
        genreEnglishRecord.save().then((result) => {
          let responseMapper = new ResponseMapper();
          let message = "Genre added successfully!";

          // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
          return responseMapper.sendResponse(res, 200, {}, message, "", 200)
        }).catch(
          (error) => {
            console.log(error)
          });
      })
        .catch(
          (error) => {
            if(error.errno==1062){
              let responseMapper = new ResponseMapper();
              let message = "Genre must be unique";
      
              // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
              return responseMapper.sendResponse(res, 422, {}, message, "", 200)
            }
          });
    })
  }

  async getAllGenre(res){
    // Get all approved genre list
  }

  async updateStatus(@Response() res, @Param() updateGenreDto: UpdateGenreDto): Promise<any> {
    const genre = await this.findGenreByGroupId(updateGenreDto.group_id);
    if (genre != undefined) {
      let payload={
        genre_id:updateGenreDto.group_id,
        is_approved:updateGenreDto.status
      }
      await this.genreApprovalEntity.save(payload).then((result) => {
        let responseMapper = new ResponseMapper();
        let message = "";

        // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
        return responseMapper.sendResponse(res, 200, {}, message, "", 204)
      }).catch(
        (error) => {
          console.log(error)
        });
    }
    else {
      let message = ["No record found against genreId"];
      let responseMapper = new ResponseMapper();

      // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
      responseMapper.sendResponse(res, 404, {}, message, "", 200)
    }
  }

  async findGenreById(id: string): Promise<GenreEntity> {
    return this.genreRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async findGenreByGroupId(group_id: string): Promise<GenreEntity> {
    return this.genreRepository.findOne({
      where: {
        group_id: group_id
      }
    });
  }

  async findGenreByNameDescription(name: string, description: string): Promise<GenreEntity> {
    return this.genreRepository.findOne({
      where: {
        name: name,
        description: description
      }
    });
  }
}