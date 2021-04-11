import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { UserRoleEntity } from '../users/userRole.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from './dto/auth.dto';
import { ResponseMapper } from '../shared/responseMapper'
import { UserEntity } from '../users/users.entity';
import { RoleEntity } from '../roles/roles.entity';
import { LoginUserDTO } from './dto/login_user.dto';
import * as jwt from 'jsonwebtoken';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
  ) { }

  async login(data: LoginUserDTO, res) {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    const auth = await this.authRepository.findOne({ where: { user_id: user?.id } });

    const isPasswordVerify = await bcrypt.compare(password, auth?.provider_user_key)
    const access_token = await this.generateToken(user);

    if (user && user?.isVerify == true) {
      if (user && isPasswordVerify) {
        let responseMapper = new ResponseMapper();
        let message = "Login successfully!";
        let data = {
          'access_token': access_token
        }
        return responseMapper.sendResponse(res, 200, data, message, "", 200)
      }
      else {
        let responseMapper = new ResponseMapper();
        let message = "Invalid email/password";
        return responseMapper.sendResponse(res, 400, {}, message, "Bad request", 400)
      }
    }
    else {
      let responseMapper = new ResponseMapper();
      let message = "Kindly verify your email";
      return responseMapper.sendResponse(res, 422, {}, message, "Bad request", 400)
    }

  }

  async register(data: AuthDTO) {
    const { user_id,role_id } = data;
    const auth = await this.authRepository.save(data);
    // const prole = await RoleEntity.create({ name: "Publisher" }).save();
    // const done = await this.userRoleRepository.save({
    //   user_id: Number(user_id),
    //   role_id: Number(role_id)
    // })
    // console.log("done",done);
    return auth;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        email: email
      }
    });
  }

  async findUserPassword(user_id: string): Promise<AuthEntity> {
    return this.authRepository.findOne({
      where: {
        user_id: user_id
      }
    });
  }

  async loginSocial(user: any, res) {
    const payload = {
      email: user.email,
      sub: user.id
    };
    let responseMapper = new ResponseMapper();
    let message = "Login successfully!";
    let jwtService = new JwtService({});

    let data = {
      'access_token': (user.accessToken != null ? user.accessToken : jwtService.sign(payload))
    }

    // SendResponse(resClass,internalStatus,Message,Error,HttpStatus)
    return responseMapper.sendResponse(res, 200, data, message, "", 200)
  }

  async generateToken(user) {
    return jwt.sign({ user },
      process.env.SECRET_KEY,
      { expiresIn: '7d' },
    );
  }

  async validateUser(email: string, password: string): Promise<any> {
    // const user = await this.userService.findByEmail(email);

    // if (user) {
    //     const socialAuth = await this.findUserPassword(user.id);
    //     const passwordVerified = bcrypt.compareSync(password, socialAuth.provider_user_key);

    //     if (user.email && passwordVerified) {
    //         return user;
    //     }
    // }
    // return null;
}

}