import { IsNotEmpty } from 'class-validator';

export class UserFavDTO {
  @IsNotEmpty()
  roleId: string;
}