import {
  Controller,
  Post,
  Logger,
  UsePipes,
  Body,
  Query,
  UseGuards,
  Response,
  Get,
  Headers
} from '@nestjs/common';

import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/auth.gaurd';
import { UserService } from './users.service';
import { UserDTO } from './dto/users.dto';
import { UserRoleDto } from './dto/user_role.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
import { ChangePasswordDto } from './dto/change_password.dto';

import { UserFavDTO } from './userFav.dto';
import { User } from './users.decorator';
import { VerifyEmailDTO } from './dto/verify_email.dto';
import {ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation} from '@nestjs/swagger';

@Controller('api/v1')
export class UserController {
  private logger = new Logger('IdeaController');

  constructor(private userService: UserService) {}

  @Post('auth/register')
  @ApiCreatedResponse({ description: 'User Registration' })
  // @ApiOkResponse({type:UserDTO, isArray:true})
  @ApiBody({type:UserDTO})
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO,@Response() res) {
    return this.userService.register(data,res);
  }

  @Post('user/send_resent_link')
  async sendResetLink(@Response() res,@Body() resetPasswordDto: ResetPasswordDto) {
      await this.userService.sendResetLink(res,resetPasswordDto);
  }

  @Post('user/reset_password')
  async resetpassword(@Response() res,@Body() forgotPasswordDto: ForgotPasswordDto){
      await this.userService.resetpassword(res,forgotPasswordDto)
  }

  @Post('user/verifyEmail')
  async verifyEmail(@Response() res,@Query() verifyEmailDTO: VerifyEmailDTO) {
      await this.userService.verifyEmail(res,verifyEmailDTO)
  }

  @Get('users')
  @UseGuards(new AuthGuard())
  getAllUsers(@Response() res,@Query() userRoleDto: UserRoleDto) {
    return this.userService.getAllUsers( res,userRoleDto);
  }

  @Post('user/change_password')
  @UseGuards(new AuthGuard())
  changePassword(@Response() res,@Body() changePasswordDTO: ChangePasswordDto ,@Headers() headers: Headers){
    return this.userService.changePassword(res,changePasswordDTO, headers);
}

  private logData(options: any) {
    console.log('USER ' + JSON.stringify(options.user))
    options.user && this.logger.log('USER ' + JSON.stringify(options.user));
    options.body && this.logger.log('BODY ' + JSON.stringify(options.body));
    options.id && this.logger.log('IDEA ' + JSON.stringify(options.id));
  }
}