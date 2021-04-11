import { BookEntity } from "books/books.entity";
import { GenreEntity } from "genres/genre.entity";

export class PaginatedGenresResultDto {
  data: GenreEntity[]
  page: number
  limit: number
  totalCount: number
}