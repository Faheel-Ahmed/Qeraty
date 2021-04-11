import { IsNotEmpty } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  provider_user_key: string;

  @IsNotEmpty()
  provider_type: string;

  @IsNotEmpty()
  user_id: string;

  // @IsNotEmpty()
  role_id: Number;
}