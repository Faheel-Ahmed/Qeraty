import { IsNotEmpty } from 'class-validator';

export class AddBookToTagDTO {
  @IsNotEmpty()
  book_id: string;

  @IsNotEmpty()
  tag_id: string;
}
