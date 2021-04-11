import { IsEmail, IsNotEmpty} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    user_name: string;

    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    signup_type: string;
}