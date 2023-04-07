import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { TaskService } from './task.service';
import {
  UpdateTaskParams,
  UpdateTaskDTO,
  CreateTaskDTO,
  FindOneParams,
  FetchTasksParams,
  MoveTasksDTO,
  FetchIncompleteTaskParams,
} from './task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  // List all user tasks
  @UseGuards(JwtAuthGuard)
  @Get('')
  async fetchAllUserTasks(@Request() req, @Query() query: FetchTasksParams) {
    return this.taskService.findAll(req, query);
  }

  // Create a task
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createTask(@Body() body: CreateTaskDTO, @Request() req) {
    return this.taskService.create(body, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('incomplete')
  async fetchAllUserIncompleteTasks(@Request() req) {
    return this.taskService.findAllIncompleteTasks(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('incomplete-detail')
  async fetchAllUserIncompleteDetailTasks(
    @Request() req,
    @Query() query: FetchIncompleteTaskParams,
  ) {
    return this.taskService.findAllIncompleteDetailTasks(req, query);
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard)
  @Post('move-specific')
  async moveIncompleteTasksArray(@Body() body: MoveTasksDTO, @Req() req) {
    return this.taskService.moveSpecificTasksToToday(body, req);
  }

  // Update task by ID
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
  @Delete(':id')
  async deleteTaskById(@Req() req, @Param() param: UpdateTaskParams) {
    return this.taskService.deleteTask(req, param);
  }

  // Find Task By ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findTaskById(@Param() { id }: FindOneParams) {
    return this.taskService.findOne(id);
  }
}
