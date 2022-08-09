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
import { CreateUserDTO } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() createUserDTO: CreateUserDTO) {
    return this.authService.login(createUserDTO, req.user);
  }

  @Post('register')
  async register(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.registerAccount(createUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('valid')
  getProfile(@Request() req) {
    return req.user;
  }
}
