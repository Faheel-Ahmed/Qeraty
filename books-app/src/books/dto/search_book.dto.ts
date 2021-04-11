import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class SearchBookDto {
    @Column()
    title: string;

    @Column()
    author_id: string;

    @Column()
    isbn: string;
}