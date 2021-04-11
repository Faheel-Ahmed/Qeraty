import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class UpdateBookDto {
    @IsNotEmpty()
    @Column()
    group_id: string;

    @IsNotEmpty()
    @Column()
    status: boolean;
}