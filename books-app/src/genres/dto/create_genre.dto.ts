import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class CreateGenreDto {
    @IsNotEmpty()
    @Column()
    genre: [];  
}