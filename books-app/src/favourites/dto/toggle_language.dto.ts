import { IsNotEmpty} from 'class-validator';
import { Column } from "typeorm";

export class ToggleLanguageDTO {

  @IsNotEmpty()
  @Column()
  language: string;

}