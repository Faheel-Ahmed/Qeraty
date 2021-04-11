import { IsNotEmpty } from 'class-validator';

export class CreateTagDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type:number
}
