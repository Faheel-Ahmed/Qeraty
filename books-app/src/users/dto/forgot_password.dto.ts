import { IsEmail, IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class ForgotPasswordDto {
   
    @IsEmail()
    @IsNotEmpty()
    @Column()
    email: string;
    
    @IsNotEmpty()
    @Column()
    password: string;

    @IsNotEmpty()
    @Column()
    confirmPassword: string;

    @IsNotEmpty()
    @Column()
    code: string;
}