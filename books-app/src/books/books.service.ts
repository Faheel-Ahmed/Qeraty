import { Injectable, HttpException, HttpStatus, Body,Param,Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseMapper } from '../shared/responseMapper'
import { BookEntity } from './books.entity';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedBooksResultDto } from './dto/paginated_books_result.dto';
import { BookDetailEntity } from './book_detail.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
  ) { }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedBooksResultDto> {
    let search=paginationDto.search;
    let language=paginationDto.language;
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const totalCount = await this.bookRepository.count();
    const books = await this.bookRepository.createQueryBuilder("book")
      // .leftJoinAndSelect("books.id", "book_detail")
      // .innerJoinAndSelect("book", "book_detail", "book.is_del = :is_del", { is_del: false })
      .innerJoinAndSelect(BookDetailEntity, 'book_detail', 'book.id = book_detail.book_id') 
      .where('book.title = :search', { search } )
      .orWhere('book_detail.author_id = :search', { search } )
      .orWhere('book_detail.isbn = :search', { search } )
      .andWhere('book.language = :language', {language } )
      .orderBy('book.created_at', "ASC")
      .offset(skippedItems)
      .limit(paginationDto.limit)
      .getMany();
      console.log("books",books);

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: books,
    }
  }
}