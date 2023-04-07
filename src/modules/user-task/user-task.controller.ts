import {
  Controller,
  Request,
  UseGuards,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserTaskService } from './user-task.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { UpdatePerfsDTO } from './user-task.dto';

@Controller('user')
export class UserTasksController {
  constructor(private userTaskService: UserTaskService) {}

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard)
  @Patch('update-prefs')
  async updatePrefs(@Request() req, @Body() body: UpdatePerfsDTO) {
    return this.userTaskService.updatePerfs(req.user.id, body);
  }
}
