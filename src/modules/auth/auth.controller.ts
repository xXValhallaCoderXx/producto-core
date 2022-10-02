import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/local.auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { AuthUserDTO, VerifyEmailParams } from './auth.dto';
// import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
@Controller('auth')
// @UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // This will only be invoked if it passes Local Strategy
    // Req will have a user param injected in
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req) {
    // This will only be invoked if it passes Local Strategy
    // Req will have a user param injected in
    return this.authService.logout(req.user);
  }

  @Post('register')
  async register(@Body() registerUserDto: AuthUserDTO) {
    return this.authService.registerAccount(registerUserDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query() query: VerifyEmailParams) {
    return this.authService.verifyEmail(query.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-jwt')
  async refreshJwt(@Request() req) {
    return this.authService.refreshJwt(req.user);
  }
}
