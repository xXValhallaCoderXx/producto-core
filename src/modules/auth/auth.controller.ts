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
import { AuthUserDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // This will only be invoked if it passes Local Strategy
    // Req will have a user param injected in
    return this.authService.login(req.user)
  }

  @Post('register')
  async register(@Body() registerUserDto: AuthUserDTO) {
    return this.authService.registerAccount(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('valid')
  checkValid(@Request() req) {
    return req.user;
  }
}
