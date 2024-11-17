import {Controller, Post, Body, Res, Req, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import {Response} from "express";
import {LoginUserDto} from "./dto/login-user.dto";
import {ApiResponse} from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'The user has been successfully registered.'})
  @ApiResponse({ status: 400, description: 'User with this email already exists!'})
  async register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'The user has been successfully logged in.'})
  async login(
      @Body() loginUserDto: LoginUserDto,
      @Res({ passthrough: true }) res: Response
  ) {
    const jwtToken = await this.authService.login(loginUserDto.email, loginUserDto.password);
    res.cookie("jwt", jwtToken, { httpOnly: true });
    return {
      message: "Login succeeded!",
      token: jwtToken,
    };
  }

  @Post('logout')
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  @ApiResponse({ status: 200, description: 'The user has been successfully logged out.'})
  async logout(@Res({passthrough: true}) res: Response, @Req() request) {
    if (!request.user) {
      throw new UnauthorizedException("You're not logged in!");
    }
    res.clearCookie("jwt");
    return {message: "Success"};
  }
}
