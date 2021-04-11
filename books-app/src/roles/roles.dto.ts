import { IsNotEmpty } from 'class-validator';

export class RoleDTO {
  @IsNotEmpty()
  name: string;
}

export class RoleRO {
  id: string;
  name: string;
}