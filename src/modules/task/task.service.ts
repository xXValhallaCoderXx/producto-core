/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDTO, ToggleTaskCompleteDTO } from './task.dto';
import { UsersService } from 'src/modules/user/users.service';
// import { GetUserTasks } from './task.dto';
import { Category } from '../categories/categories.model';
@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
    private usersService: UsersService,
  ) {}

  async findAll(data: any, req: any): Promise<Task[]> {
    return this.taskModel.findAll({
      where: {
        userId: req.user.userId,
      },
      attributes: ['title', 'description', 'completed', 'createdAt', 'id'],
      include: {
        model: Category,
        attributes: ['name', 'active'],
        where: {
          active: true,
        },
      },
    });
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await task.destroy();
  }

  findOne(id: number): Promise<Task> {
    return this.taskModel.findOne({
      where: {
        id,
      },
    });
  }

  async create(data: CreateTaskDTO, req: any): Promise<Task> {
    const user = await this.usersService.findOne(req.user.username);
    if (!user) {
      return null;
    }

    return await this.taskModel.create<Task>({
      ...data,
      completed: 'false',
      userId: req.user.userId,
    });
  }

  async toggleComplete(data: ToggleTaskCompleteDTO, req: any): Promise<any> {
    const user = await this.usersService.findOne(req.user.username);
    if (!user) {
      return null;
    }

    const result = await this.taskModel.update<Task>(
      // @ts-ignore
      { completed: data.completed },
      { returning: true, where: { id: data.taskId, userId: req.user.userId } },
    );
    return result[1][0];
  }
}
