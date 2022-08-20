import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/local.auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { LoginUserDTO, RegisterUserDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginUserDto: LoginUserDTO) {
    return this.authService.login(loginUserDto, req.user);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDTO) {
    return this.authService.registerAccount(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('valid')
  getProfile(@Request() req) {
    return req.user;
  }
}
