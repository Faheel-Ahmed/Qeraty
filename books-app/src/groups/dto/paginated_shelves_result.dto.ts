import { ShelveEntity } from "shelves/shelves.entity";

export class PaginatedShelvesResultDto {
  data: ShelveEntity[]
  page: number
  limit: number
  totalCount: number
  hasMore:boolean
}