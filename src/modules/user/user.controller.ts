import {
  Controller,
  Request,
  UseGuards,
  Patch,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { UpdatePerfsDTO, UpdatePasswordDTO } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  checkValid(@Request() req) {
    return this.userService.findUserById(req.user.id);
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard)
  @Patch('update-password')
  async updatePassword(@Request() req, @Body() body: UpdatePasswordDTO) {
    return this.userService.updatePassword(req.user.id, body);
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard)
  @Patch('update-prefs')
  async updatePrefs(@Request() req, @Body() body: UpdatePerfsDTO) {
    return this.userService.updatePerfs(req.user.id, body);
  }
}
