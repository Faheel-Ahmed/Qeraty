import { Injectable, HttpException, HttpStatus, Headers, Response, Body, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { UserDTO } from './dto/users.dto';
import { UserRoleDto } from './dto/user_role.dto';
import { UserFavDTO } from './userFav.dto';
import { CreateUserDto } from './dto/create_user-dto';
import { ChangePasswordDto } from './dto/change_password.dto';
import { AuthService } from '../auth/auth.service'
import { AuthEntity } from '../auth/auth.entity';
import { ResponseMapper } from '../shared/responseMapper';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
import { SOCIAL_LOGIN_TYPE } from '../shared/enums';
import { VerifyEmailDTO } from './dto/verify_email.dto';
import * as jwt from 'jsonwebtoken';
import { RoleEntity } from '../roles/roles.entity';
import jwt_decode from "jwt-decode";

var nodemailer = require('nodemailer');
const fs = require('fs');
const bcrypt = require('bcrypt');
var randomstring = require("randomstring");

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) { }

  async sendResetLink(@Response() res, @Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
    let user = await this.findByEmail(resetPasswordDto.email)
    if (user != null) {
      var code = randomstring.generate(30);
      var link = process.env.USER_APP_URL + "/resetPassword?email=" + resetPasswordDto.email + "&code=" + code;
      let tempPath = '../../src/users/public/email-templates/reset_password_email.html';
      var fs = require('fs');
      var path = require('path');

      user.reset_token = code;

      await user.save().then(
        (result) => {
          fs.readFile(path.join(__dirname, tempPath), 'utf8', function (err, data) {
            if (err) {
              return console.log(err);
            }
            var mapObj = {
              link_url: link,
              email_label: resetPasswordDto.email,
            };

            // Pass the variable to email
            var resultFile = data.replace(/link_url|email_label/gi, function (matched) {
              return mapObj[matched];
            });

            let transport = nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: process.env.SMTP_PORT,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
              }
            });

            const message = {
              from: process.env.FROM_EMAIL,
              // to: 'noreplyqeraty@gmail.com',
              to: resetPasswordDto.email,
              subject: 'RESET PASSWORD EMAIL',
              html: resultFile
            };
            transport.sendMail(message, function (err, info) {
              if (err) {
                console.log(err);
              } else {
                let message = "Reset Link sent successfully";
                let responseMapper = new ResponseMapper();

                // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
                responseMapper.sendResponse(res, 200, {}, message, "", 200)
              }
            });
          })
        }
      ).catch(
        (error) => {
          console.log('saving error')
        }
      );
    }
    else {
      let responseMapper = new ResponseMapper();
      let message = "Email not found";

      // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
      responseMapper.sendResponse(res, 404, {}, message, "", 200)
    }
  }

  async resetpassword(@Response() res, @Body() forgotPasswordDto: ForgotPasswordDto) {
    let user = await this.findByEmail(forgotPasswordDto.email);
    if (user != null) {
      if (user.reset_token == forgotPasswordDto.code) {
        if (forgotPasswordDto.password == forgotPasswordDto.confirmPassword) {
          let auth = await this.findAuthByUserId(user.id)
          const salt = bcrypt.genSaltSync(10);
          const password = bcrypt.hashSync(forgotPasswordDto.password, salt);
          auth.provider_user_key = password;
          auth.save();
          user.reset_token = null;
          user.save();
          let userData = await this.findAuthByUserId(user.id)
          const access_token = await this.generateToken(userData);
          let responseData = {
            'accessToken': access_token
          }
          let responseMapper = new ResponseMapper();
          let message = "Password is reset";

          // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
          responseMapper.sendResponse(res, 200, responseData, message, "", 200)
        } else {
          let responseMapper = new ResponseMapper();
          let message = "Password is incorrect";

          // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
          responseMapper.sendResponse(res, 422, {}, message, "", 200)
        }
      } else {
        let responseMapper = new ResponseMapper();
        let message = "Invalid code";

        // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
        responseMapper.sendResponse(res, 422, {}, message, "", 200)
      }
    }
    else {
      let responseMapper = new ResponseMapper();
      let message = ["Email not found"];

      // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
      responseMapper.sendResponse(res, 404, {}, message, "BadRequest", 200)
    }
  }

  async register(data: UserDTO, @Response() res) {
    const { email, username, role_id } = data;
    var userData = {};
    var userSave;
    var user = await this.userRepository.findOne({ where: { email } });
    var userNameExist = await this.userRepository.findOne({ where: { username } });
    var responseMapper = new ResponseMapper();

    if (user || userNameExist) {
      let message = "Username already exists";
      return responseMapper.sendResponse(res, 422, {}, message, "", 200)
    }

    user = await this.userRepository.create(data);
    var message = "";
    const salt = bcrypt.genSaltSync(10);

    const password = bcrypt.hashSync(data.password, salt);

    await this.userRepository.save(user).then((result) => {
      let auth = {
        provider_user_key: password,
        provider_type: result['provider_type'],
        user_id: result['id'],
        role_id: role_id
      }
      userSave = this.authService.register(auth)
      userData = user.toResponseObject();
      if (userSave) {
        message = "Registered and verification email sent successfully!";
        this.sendVerificationEmail(res, email, result['emailCode']);
      }
    })
      .catch(
        (error) => {
          message = "Username already exists";
          return responseMapper.sendResponse(res, 422, {}, message, "", 200)
        }
      );

    // send success response
    if (userSave) {
      return responseMapper.sendResponse(res, 201, userData, message, "", 201)
    }
  }

  async verifyEmail(@Response() res, @Query() verifyEmailDTO: VerifyEmailDTO) {
    let user = await this.findByEmail(verifyEmailDTO.email);
    if (user.isVerify == false) {
      if (verifyEmailDTO.email == user.email && verifyEmailDTO.code == user.emailCode) {
        user.isVerify = true;
        user.emailCode = '';
        await user.save().then((result) => {
          let responseMapper = new ResponseMapper();
          let message = "Email verified successfully!";

          // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
          responseMapper.sendResponse(res, 200, {}, message, "", 200)
        }).catch(
          (error) => {
            console.log(error)
          });
      }
      else {
        let responseMapper = new ResponseMapper();
        let message = "Invalid email or code";

        // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
        responseMapper.sendResponse(res, 422, {}, message, "", 200)
      }
    }
    else {
      let responseMapper = new ResponseMapper();
      let message = "Email already verified";

      // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
      responseMapper.sendResponse(res, 422, {}, message, "", 200)
    }
  }

  async sendVerificationEmail(res, email: string, code: string) {
    var link = process.env.USER_APP_URL + "/verifyEmail?email=" + email + "&code=" + code;
    let tempPath = '../../src/users/public/email-templates/verification_email.html';
    var fs = require('fs');
    var path = require('path');

    fs.readFile(path.join(__dirname, tempPath), 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var mapObj = {
        link_url: link,
        email_label: email,
      };

      // Pass the variable to email
      var resultFile = data.replace(/link_url|email_label/gi, function (matched) {
        return mapObj[matched];
      });

      let transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const message = {
        from: process.env.FROM_EMAIL,
        // to: 'noreplyqeraty@gmail.com',
        to: email,
        subject: 'VERIFICATION EMAIL',
        html: resultFile
      };
      transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("verification Email Sent to", email)
        }
      });
    })
  }

  async changePassword(@Response() res, @Body() changePasswordDTO: ChangePasswordDto, @Headers() headers) {
    const userData = jwt_decode(headers.authorization)

    let auth = await this.findAuthByUserId(userData['user']['id'])
    const isPasswordVerify = await bcrypt.compare(changePasswordDTO.oldPassword, auth?.provider_user_key)

    if (isPasswordVerify == true) {
      if (changePasswordDTO.newPassword == changePasswordDTO.confirmPassword) {
        if (changePasswordDTO.oldPassword != changePasswordDTO.newPassword) {

          const salt = bcrypt.genSaltSync(10);
          const password = bcrypt.hashSync(changePasswordDTO.newPassword, salt);
          auth.provider_user_key = password;
          auth.save();
          const access_token = await this.generateToken(userData);
          let responseData = {
            'accessToken': access_token
          }
          let responseMapper = new ResponseMapper();
          let message = "Password changed successfully";

          // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
          responseMapper.sendResponse(res, 200, responseData, message, "", 200)

        }
        else {
          let responseMapper = new ResponseMapper();
          let message = "Old password and new password are same";
          responseMapper.sendResponse(res, 405, {}, message, "", 200)
        }
      }
      else {
        let responseMapper = new ResponseMapper();
        let message = "New and confirm password mismatched";
        responseMapper.sendResponse(res, 406, {}, message, "", 200)
      }
    }
    else {
      let responseMapper = new ResponseMapper();
      let message = "Old password is incorrect";
      responseMapper.sendResponse(res, 407, {}, message, "", 200)
    }
  }

  async getAllUsers(@Response() res, @Query() userRoleDTO: UserRoleDto) {
    let users = await this.userRepository.find({
      where: {
        user_type: userRoleDTO.role_id
      }
    });
    if (users.length > 0) {
      let responseMapper = new ResponseMapper();
      let message = "Users fetch successfully!";

      // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
      responseMapper.sendResponse(res, 200, users, message, "", 200)
    }
    else {
      let responseMapper = new ResponseMapper();
      let message = "No record found";

      // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
      responseMapper.sendResponse(res, 404, {}, message, "", 200)
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        email: email
      }
    });
  }

  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    // Hash Password
    const salt = bcrypt.genSaltSync(10);

    const password = bcrypt.hashSync(createUserDto.password, salt);

    const user = new UserEntity();
    user.username = createUserDto.user_name;
    user.email = createUserDto.email;

    let userId = '';

    await user.save().then(
      (result) => {
        userId = result.id;
      }
    ).catch(
      (error) => {
        return {
          error: 'Validation Failed',
        };
      }
    );

    const auth = new AuthEntity();

    // If login is manual then bcrypt the password otherwise place the social id
    auth.provider_user_key = (createUserDto.signup_type == String(SOCIAL_LOGIN_TYPE.MANUAL) ? password : createUserDto.password);

    auth.provider_type = createUserDto.signup_type;
    auth.user_id = userId;
    const ans = await auth.save();
    await auth.save().then(
      (result) => {
        const user_role = new RoleEntity();
        user_role.name = 'Hello';
        // user_role.role_id=createUserDto.role_id;
        return user_role.save();
      }
    ).catch(
      (error) => {
        return {
          error: 'Validation Failed',
        };
      }
    );
    return auth.save();
  }

  async findAuthByUserId(id: string): Promise<AuthEntity> {
    return AuthEntity.findOne({
      where: {
        user_id: id
      }
    });
  }

  async generateToken(user) {
    return jwt.sign({ user },
      process.env.SECRET_KEY,
      { expiresIn: '7d' },
    );
  }

  async findOrCreateSocialRecord(socialId: string,
    socialLoginType: SOCIAL_LOGIN_TYPE,
    email: string,
    firstName: string,
    lastName: string
  ) {
  }
}