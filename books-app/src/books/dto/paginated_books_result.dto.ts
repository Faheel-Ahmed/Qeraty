import { BookEntity } from "books/books.entity";

export class PaginatedBooksResultDto {
  data: BookEntity[]
  page: number
  limit: number
  totalCount: number
}