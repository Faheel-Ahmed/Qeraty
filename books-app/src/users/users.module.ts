import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { UserEntity } from './users.entity';
import { AuthEntity } from '../auth/auth.entity';
import { RoleEntity } from '../roles/roles.entity';
import { AuthService } from '../auth/auth.service';
import { UserRoleEntity } from './userRole.entity';
import { RoleService } from '../roles/role.service';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity,AuthEntity,UserRoleEntity])],
  controllers: [UserController],
  providers: [UserService,AuthService,RoleService],
  exports: [
    UserService,
    AuthService
  ]
})
export class UserModule {}