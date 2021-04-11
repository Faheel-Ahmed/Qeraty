import {Controller,Get,UseGuards, Query} from '@nestjs/common';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedBooksResultDto } from './dto/paginated_books_result.dto';
import { BooksService } from './books.service';
import { AuthGuard } from '../shared/auth.gaurd';

@Controller('api/v1')
export class BooksController {
    constructor(
        private booksService: BooksService) {
    }

    @Get('books')
    @UseGuards(new AuthGuard())
    findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedBooksResultDto> {
        paginationDto.page = Number(paginationDto.page)
        paginationDto.limit = Number(paginationDto.limit)

        return this.booksService.findAll({
            ...paginationDto,
            limit: paginationDto.limit > 10 ? 10 : paginationDto.limit
        })
    }
}