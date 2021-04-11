import { IsEmail, IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class ResetPasswordDto {
  
    @IsEmail()
    @IsNotEmpty()
    @Column()
    email: string;
}