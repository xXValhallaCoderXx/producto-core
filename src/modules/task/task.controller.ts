import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { TaskService } from './task.service';
import {
  UpdateTaskParams,
  UpdateTaskDTO,
  CreateTaskDTO,
  FindOneParams,
} from './task.dto';
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async fetchAllUserTasks(@Request() req, @Query() query) {
    return this.taskService.findAll(req, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createTask(@Body() body: CreateTaskDTO, @Request() req) {
    return this.taskService.create(body, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTaskById(
    @Body() body: UpdateTaskDTO,
    @Req() req,
    @Param() param: UpdateTaskParams,
  ) {
    return this.taskService.updateTask(body, req, param);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findTaskById(@Param() { id }: FindOneParams) {
    return this.taskService.findOne(id);
  }
}
