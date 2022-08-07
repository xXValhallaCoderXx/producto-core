import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('')
  async allTasks(@Request() req) {
    return this.taskService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createTask(@Body() body, @Request() req) {
    return this.taskService.create(body, req);
  }

  @Get(':id')
  async findTask(@Param() param) {
    return this.taskService.findOne(param.id);
  }

  @Post(':id')
  async updateTask(@Body() body, @Req() req) {
    return this.taskService.findOne(body);
  }
}
