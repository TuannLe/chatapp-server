import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, SigninDto } from './dto';
import { Routes } from '../utils/constants';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post(Routes.SIGN_IN)
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post(Routes.SIGN_UP)
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
}
