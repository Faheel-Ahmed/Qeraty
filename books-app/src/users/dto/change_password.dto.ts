import { IsEmail, IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class ChangePasswordDto {
   
    @IsEmail()
    @IsNotEmpty()
    @Column()
    oldPassword: string;
    
    @IsNotEmpty()
    @Column()
    newPassword: string;

    @IsNotEmpty()
    @Column()
    confirmPassword: string;

    @IsNotEmpty()
    @Column()
    code: string;
}