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
import { ToggleTaskCompleteDTO } from './task.dto';
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async allTasks(@Body() getUserTasks: any, @Request() req) {
    return this.taskService.findAll(getUserTasks, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createTask(@Body() body, @Request() req) {
    return this.taskService.create(body, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async updateTask(
    @Body() body: ToggleTaskCompleteDTO,
    @Req() req,
    // @Param() param,
  ) {
    return this.taskService.toggleComplete(body, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findTask(@Param() param) {
    return this.taskService.findOne(param.id);
  }
}
