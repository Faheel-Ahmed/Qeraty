import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { UserModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthEntity } from './auth.entity';
import { UserRoleEntity } from 'users/userRole.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './config/constants';
import { FacebookStrategy } from './strategies/facebook-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserEntity } from 'users/users.entity';
import { RoleEntity } from 'roles/roles.entity';
import { RoleModule } from 'roles/role.module';
import { RoleService } from 'roles/role.service';


@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
    TypeOrmModule.forFeature([AuthEntity, UserRoleEntity,UserEntity,RoleEntity]),
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
    RoleService
  ],
  exports: [
    AuthService
  ],
})

export class AuthModule { }