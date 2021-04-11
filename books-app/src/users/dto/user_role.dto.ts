import { IsEmail, IsNotEmpty} from "class-validator";

export class UserRoleDto {
    @IsNotEmpty()
    role_id: string;
}