import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class UpdateGenreDto {
    @IsNotEmpty()
    @Column()
    group_id: string;

    @IsNotEmpty()
    @Column()
    status: boolean;
}