import {
  Controller,
  Request,
  UseGuards,
  Patch,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  Post,
  Query,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/local.auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { RefreshTokenAuthGuard } from 'src/guards/jwt-refresh.auth.guard';
import { AuthUserDTO, VerifyEmailParams, UpdateEmailDTO } from './auth.dto';
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

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard)
  @Patch('update-email')
  async updateEmail(@Request() req, @Body() body: UpdateEmailDTO) {
    return this.authService.updateEmail(req.user.id, body);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('refresh-jwt')
  async refreshJwt(@Request() req) {
    return this.authService.refreshJwt(req.user);
  }
}
