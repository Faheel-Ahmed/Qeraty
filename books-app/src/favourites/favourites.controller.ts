import {
  Controller,
  Post,
  UsePipes,
  Body,
  Response,
  Headers,
  Get,
  Query,
  UseGuards
} from '@nestjs/common';

import { AuthGuard } from '../shared/auth.gaurd';
import { FavouritesService } from './favourites.service';
import { FavouritesDTO } from './dto/add_user_favourites.dto';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedGenresResultDto } from './dto/paginated_genres_result.dto';

@Controller('api/v1')
export class RoleController {
  constructor(private favouritesService: FavouritesService) {}

  @Post('user/favourites')
  @UseGuards(new AuthGuard())
  addUserFavourites(@Body() data: FavouritesDTO,@Response() res,@Headers() headers: Headers) {
    return this.favouritesService.addUserFavourites(data,res,headers);
  }

  @Get('user/favourite_genre') 
  @UseGuards(new AuthGuard())
  getUserFavouriteGenre(@Query() paginationDto: PaginationDto,@Response() res,@Headers() headers: Headers): Promise<PaginatedGenresResultDto>  {
    return this.favouritesService.getUserFavouriteGenre(res,headers,paginationDto);
  }
}