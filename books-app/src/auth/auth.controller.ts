import { Controller, Request,UsePipes,Body, Query,Param,Get, HttpStatus, Post, UseGuards, Response } from '@nestjs/common';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import {ResponseMapper} from '../shared/responseMapper'
import { AuthDTO } from './dto/auth.dto';
import { LoginUserDTO } from './dto/login_user.dto';


@Controller('api/v1')
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UserService
    ) {}

  @Post('auth/register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: AuthDTO) {
    return this.authService.register(data);
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() data:LoginUserDTO,@Response() res) {
    return this.authService.login(data,res);
  }

  @Get('auth/facebook')
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
      return HttpStatus.OK;
  }

  // For web
  @Get('auth/facebook/redirect')
  @UseGuards(AuthGuard("facebook"))
  async facebookRedirect(@Request() req, @Response() res) {
      const user = await this.userService.findByEmail(req.user.user.email);

      if (user != null) {
          return this.authService.loginSocial(req.user, res);
      }
      else {
          // Create user if the email is not registered before (manual,facebook,amazon)
          const createUserDto = {
              user_name: req.user.user.firstName + ' ' + req.user.user.lastName,
              email: req.user.user.email,
              password: req.user.user.id,
              signup_type: '1',
              accepted_request: true,
              role_id:1
          };

          await this.userService.create(createUserDto);
          return this.authService.loginSocial(req.user, res);
      }
  }

  // For app
  @Get('auth/facebook/debug_token')
  async facebookDebugToken(@Request() req) {
      let access_token = req.query.access_token;
      let input_token = req.query.input_token;
      var debug_token_url = 'https://graph.facebook.com/debug_token?input_token=' + input_token + '&access_token=' + access_token;
      let response = await fetch(debug_token_url);
      return await response.json();
  }

  // For app
  @Get('auth/facebook/me')
  async facebookMe(@Request() req, @Response() res) {
      let access_token = req.query.access_token;
      var debug_token_url = 'https://graph.facebook.com/me?fields=id,name,email&access_token=' + access_token;
      let response = await fetch(debug_token_url);
      let data = await response.json();
      if (data.id != undefined) {
          const user = await this.userService.findByEmail(data?.email);
          if (user != null) {
              return this.authService.loginSocial(data, res);
          }
          else {

              // Create user if the email is not found.
              const createUserDto = {
                  user_name: data?.name,
                  email: data?.email,
                  password: data?.id,
                  signup_type: '1',
                  accepted_request: true,
                  role_id:1
              };
              await this.userService.create(createUserDto);
              return this.authService.loginSocial(data, res);
          }
      }
      else {
          let responseMapper = new ResponseMapper();
          let message = ["Access token is invalid"];

          // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
          responseMapper.sendResponse(res, 400, {}, message, "Bad Request", 400)
      }
  }


  @Get('auth/google')
  @UseGuards(AuthGuard("google"))
  async googleLogin(): Promise<any> {
      return HttpStatus.OK;
  }

  // For app
  @Get('auth/google/me')
  async googleMe(@Request() req, @Response() res) {
      let id_token = req.query.id_token;
      var google_token_url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + id_token;
      let response = await fetch(google_token_url);
      let data = await response.json();
      if (data.id != undefined) {
          const user = await this.userService.findByEmail(data?.email);

          if (user != null) {
              return this.authService.loginSocial(data, res);
          }
          else {
              // Create user if the email is not found.
              const createUserDto = {
                  user_name: data?.name,
                  email: data?.email,
                  password: data?.id,
                  signup_type: '2',
                  accepted_request: true,
                  role_id:1
              };
              await this.userService.create(createUserDto);
              return this.authService.loginSocial(data, res);
          }
      }
      else {
          let responseMapper = new ResponseMapper();
          let message = ["Access token is invalid"];

          // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
          responseMapper.sendResponse(res, 400, {}, message, "Bad Request", 400)
      }
  }

  // For app
  @Get('auth/twitter/me')
  async twitterMe(@Request() req, @Response() res) {
      let oauth_access_token = req.query.oauth_access_token;
      var twitter_token_url = 'https://api.twitter.com/1/account/verify_credentials.json?oauth_access_token=' + oauth_access_token;
      let response = await fetch(twitter_token_url);
      let data = await response.json();
      if (data.id != undefined) {
          const user = await this.userService.findByEmail(data?.email);
          if (user != null) {
              return this.authService.loginSocial(data, res);
          }
          else {
              // Create user if the email is not found.
              const createUserDto = {
                  user_name: data?.name,
                  email: data?.email,
                  password: data?.id,
                  signup_type: '3',
                  accepted_request: true,
                  role_id:1

              };
              await this.userService.create(createUserDto);
              return this.authService.loginSocial(data, res);
          }
      }
      else {
          let responseMapper = new ResponseMapper();
          let message = ["Access token is invalid"];

          // SendResponse(resClass,internalStatus,data,Message,Error,HttpStatus)
          responseMapper.sendResponse(res, 400, {}, message, "Bad Request", 400)
      }
  }

  @Get('auth/amazon')
//   @UseGuards(AuthGuard("amazon"))
  async amazonLogin(): Promise<any> {
      return HttpStatus.OK;
  }

  @Get('auth/amazon/callback')
//   @UseGuards(AuthGuard("amazon"))
  async amazonRedirect(@Request() req, @Response() res) {
      // return req.user;
      return this.authService.loginSocial(req.user, res);
  }
}