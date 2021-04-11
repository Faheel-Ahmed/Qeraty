import { IsNotEmpty } from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UserDTO {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsNotEmpty()
  @ApiProperty()
  provider_type:string

  // @IsNotEmpty()
  @ApiProperty()
  role_id:Number


  @ApiProperty()
  emailCode:string
}

export class UserRO {
  id: string;
  username: string;
  city:string;
  country:string;
  provider_type:string;
  created_at: Date;
  updated_at: Date;
  token?: string;
  // roles: RoleEntity[];
}