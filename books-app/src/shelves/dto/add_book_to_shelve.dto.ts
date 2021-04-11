import { IsNotEmpty } from 'class-validator';

export class AddBookToShelfDTO {
  @IsNotEmpty()
  book_id: string;

  @IsNotEmpty()
  shelf_id: string;
}
