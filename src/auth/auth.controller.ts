import {Controller, Post, Body, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import {Response} from "express";

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  async login(
      @Body('email') email: string,
      @Body('password') password: string,
      @Res({ passthrough: true }) res: Response
  ) {
    const jwtToken = await this.authService.login(email, password);
    res.cookie("jwt", jwtToken, { httpOnly: true });
    return {message: "Login succeeded!"};
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) res: Response) {
    res.clearCookie("jwt");
    return {message: "Success"};
  }
}
