import {
  Controller,
  Request,
  UseGuards,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { UpdateEmailDTO } from './user-profile.dto';
// import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
@Controller('user')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard)
  @Patch('update-email')
  async updateEmail(@Request() req, @Body() body: UpdateEmailDTO) {
    return this.userProfileService.updateUserEmail(req.user.id, body);
  }
}
