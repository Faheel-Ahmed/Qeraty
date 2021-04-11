import {
  Controller,
  Post,
  UsePipes,
  Body,
  Response
} from '@nestjs/common';

import { ValidationPipe } from '../shared/validation.pipe';
import { RoleService } from './role.service';
import { RoleDTO } from './roles.dto';

@Controller('api/v1')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('role')
  @UsePipes(new ValidationPipe())
  addRole(@Body() data: RoleDTO,@Response() res) {
    return this.roleService.addRole(data,res);
  }
}