import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class AddBookDto {
    @IsNotEmpty()
    @Column()
    genre: [];  
}