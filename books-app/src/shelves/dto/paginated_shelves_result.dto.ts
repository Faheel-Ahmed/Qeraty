import { BookEntity } from "books/books.entity";
import { GenreEntity } from "genres/genre.entity";
import { ShelveEntity } from "shelves/shelves.entity";

export class PaginatedShelvesResultDto {
  data: ShelveEntity[]
  page: number
  limit: number
  totalCount: number
  hasMore:boolean
}