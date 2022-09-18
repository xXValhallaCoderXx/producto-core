import {
  Controller,
  Request,
  UseGuards,
  Patch,
  Body,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { UpdatePerfsDTO } from './user.dto';

// import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
@Controller('user')
// @UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  checkValid(@Request() req) {
    return this.userService.findUserById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-perfs')
  async login(@Request() req, @Body() body: UpdatePerfsDTO) {
    // This will only be invoked if it passes Local Strategy
    // Req will have a user param injected in
    return this.userService.updatePerfs(req.user.id, body);
  }
}
