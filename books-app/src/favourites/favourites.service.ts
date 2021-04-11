import { Injectable, HttpException, HttpStatus, Headers, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseMapper } from '../shared/responseMapper'
import { UserFavAuthorsEntity } from './user_fav_authors.entity';
import { UserFavPublishersEntity } from './user_fav_publishers.entity';
import { UserFavGenresEntity } from './user_fav_genres.entity';
import { FavouritesDTO } from './dto/add_user_favourites.dto';
import { UserRoleEntity } from 'users/userRole.entity';
import jwt_decode from "jwt-decode";
import { GenreEntity } from 'genres/genre.entity';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedGenresResultDto } from './dto/paginated_genres_result.dto';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(UserFavAuthorsEntity)
    private userFavAuthorsRepository: Repository<UserFavAuthorsEntity>,
    @InjectRepository(UserFavPublishersEntity)
    private userFavPublishersRepository: Repository<UserFavPublishersEntity>,
    @InjectRepository(UserFavGenresEntity)
    private userFavGenresRepository: Repository<UserFavGenresEntity>,
    @InjectRepository(GenreEntity)
    private genreRepository: Repository<GenreEntity>,
  ) { }

  async addUserFavourites(data: FavouritesDTO, res, @Headers() headers) {
    const userData = jwt_decode(headers.authorization)

    const user_id = userData['user']['id'];
   
    if (data.role_id.length > 0) {
      await this.addUserRole(data.role_id, user_id, res);
    }
    if (data.favourite_genres.length > 0) {
      await this.addUserFavouriteGenres(data.favourite_genres, user_id, res);
    }
    if (data.favourite_authors.length > 0) {
      await this.addUserFavouriteAuthors(data.favourite_authors, user_id, res);
    }
    if (data.favourite_publishers.length > 0) {
      await this.addUserFavouritePublishers(data.favourite_publishers, user_id, res);
    }

    let responseMapper = new ResponseMapper();
    let message = "User Favourites added successfully";

    // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
    return responseMapper.sendResponse(res, 200, {}, message, "", 200)
  }

  async getUserFavouriteGenre(res, @Headers() headers, paginationDto: PaginationDto): Promise<PaginatedGenresResultDto> {
    const userData = jwt_decode(headers.authorization)
    const user_id = userData['user']['id'];
    const favouriteGenre = await this.getUserGenre(user_id, paginationDto);
    let responseMapper = new ResponseMapper();
    let message = "User Favourite Genres fetch successfully";

    // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
    return responseMapper.sendResponse(res, 200, favouriteGenre, message, "", 200)
  }

  async getUserGenre(user_id, paginationDto) {
    let language = paginationDto.language;
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const genre = await this.genreRepository.createQueryBuilder("genre")
      .innerJoinAndSelect(UserFavGenresEntity, 'user_fav_genre', 'genre.group_id = user_fav_genre.genre_id')
      .where('user_fav_genre.user_id = :user_id', { user_id })
      .andWhere('genre.language = :language', { language })
      .orderBy('genre.created_at', "ASC")
      .getMany();

    const totalCount = genre.length;
    const data = genre.splice(skippedItems, paginationDto.limit)
    const hasMore = (totalCount > (skippedItems + Number(paginationDto.limit)));

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      hasMore,
      data
    }
  }

  async addUserFavouriteAuthors(authors: [], user_id: string, res) {
    authors.map(async (item, key) => {
      await this.userFavAuthorsRepository.save({
        user_id: Number(user_id),
        author_id: Number(item)
      }).then(async (result) => {
        return result;
      }).catch(
        (error) => {
          if (error.errno == 1452) {
            let responseMapper = new ResponseMapper();
            let message = "Invalid Author id";

            // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
            return responseMapper.sendResponse(res, 422, {}, message, "", 200)
          }
        });
    })
  }

  async addUserFavouritePublishers(publishers: [], user_id: string, res) {
    publishers.map(async (item, key) => {
      await this.userFavPublishersRepository.save({
        user_id: Number(user_id),
        publisher_id: Number(item)
      }).then(async (result) => {
        return result;
      }).catch(
        (error) => {
          if (error.errno == 1452) {
            let responseMapper = new ResponseMapper();
            let message = "Invalid Publisher id";

            // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
            return responseMapper.sendResponse(res, 422, {}, message, "", 200)
          }
        });
    })
  }

  async addUserFavouriteGenres(genres: [], user_id: string, res) {
    genres.map(async (item, key) => {
      await this.userFavGenresRepository.save({
        user_id: Number(user_id),
        genre_id: Number(item)
      }).then(async (result) => {
        return result;
      }).catch(
        (error) => {
          if (error.errno == 1452) {
            let responseMapper = new ResponseMapper();
            let message = "Invalid Genre id";

            // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
            return responseMapper.sendResponse(res, 422, {}, message, "", 200)
          }
        });
    })
  }

  async addUserRole(role_id: string, user_id: string, res) {
    const userRole = {
      user_id: Number(user_id),
      role_id: Number(role_id)
    }
    await this.userRoleRepository.save(userRole).then(async (result) => {
      return result;
    }).catch(
      (error) => {
        if (error.errno == 1452) {
          let responseMapper = new ResponseMapper();
          let message = "Invalid Role id";

          // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
          return responseMapper.sendResponse(res, 422, {}, message, "", 200)
        }
      });
  }
}