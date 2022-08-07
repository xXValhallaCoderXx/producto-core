import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Param,
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
    console.log('REQ: ', req.user);
    return this.taskService.create(body);
  }

  @Get(':id')
  async findTask(@Param() param) {
    return this.taskService.findOne(param.id);
  }

  @Post(':id')
  async updateTask(@Body() body) {
    return this.taskService.findOne(body);
  }
}
