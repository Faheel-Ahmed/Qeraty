import {
  Controller,
  Post,
  UsePipes,
  Query,
  Response,
  UseGuards,
  Headers,
  Get
} from '@nestjs/common';
import { ValidationPipe } from '../shared/validation.pipe';
import { ShelvesService } from './shelves.service';
import { AddBookToShelfDTO } from './dto/add_book_to_shelve.dto';
import { AuthGuard } from '../shared/auth.gaurd';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedShelvesResultDto } from './dto/paginated_shelves_result.dto';

@Controller('api/v1')
export class ShelvesController {
  constructor(private shelvesService: ShelvesService) {}

  @Post('shelf/book') 
  @UseGuards(new AuthGuard())
  async addBookToShelf(@Response() res,@Query() addBookToShelfDTO: AddBookToShelfDTO,@Headers() headers: Headers) {
      return this.shelvesService.addBookToShelf(res,addBookToShelfDTO,headers);
  }

  @Get('shelves') 
  @UseGuards(new AuthGuard())
  getUserShelves(@Query() paginationDto: PaginationDto,@Response() res,@Headers() headers: Headers): Promise<PaginatedShelvesResultDto>  {
    return this.shelvesService.getUserShelves(res,headers,paginationDto);
  }

  @Get('shelves') 
  @UseGuards(new AuthGuard())
  getUsersBookByShelfId(@Query() paginationDto: PaginationDto,@Response() res,@Headers() headers: Headers): Promise<PaginatedShelvesResultDto>  {
    return this.shelvesService.getUserBooksByShelfId(res,headers,paginationDto);
  }
}