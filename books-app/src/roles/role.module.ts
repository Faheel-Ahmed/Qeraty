import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleEntity } from 'users/userRole.entity';
import { RoleEntity } from './roles.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity,UserRoleEntity])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}