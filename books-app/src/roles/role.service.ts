import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseMapper } from '../shared/responseMapper'
import { RoleEntity } from './roles.entity';
import { RoleDTO } from './roles.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) { }

  async addRole(data: RoleDTO, res) {
    let { name } = data;
    let roleAdded = await this.roleRepository.save({
      name: JSON.stringify(name)
    });
    let responseMapper = new ResponseMapper();
    let message = "";
    if (roleAdded) {
      message = "Role added successfully";
      let roleData = {
        id: roleAdded.id,
        name: JSON.parse(roleAdded.name)
      }
      
      // SendResponse(resClass,internalStatus,Message,Error,HttpStatus)
      return responseMapper.sendResponse(res, 200, roleData, message, "", 200)
    } 
    else{
      return responseMapper.sendResponse(res, 400, {}, message, "Bad Request", 200)
    }
  }
}