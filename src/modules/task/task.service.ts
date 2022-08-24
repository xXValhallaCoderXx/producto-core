/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDTO, UpdateTaskDTO, UpdateTaskParams } from './task.dto';
import { UsersService } from 'src/modules/user/users.service';
import moment = require('moment');

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
    private usersService: UsersService,
  ) {}

  async findAll(req: any, query: any): Promise<Task[]> {
    return this.taskModel.findAll({
      where: {
        userId: req.user.id,
        ...(query.date && {
          deadline: moment(query.date).toISOString(),
        }),
      },
      order: [['createdAt', 'ASC']],
      attributes: [
        'title',
        'completed',
        'createdAt',
        'id',
        'focus',
        'deadline',
      ],
    });
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await task.destroy();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findOne({
      where: {
        id,
      },
    });

    if (!task) throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    return task;
  }

  async create(data: CreateTaskDTO, req: any): Promise<Task> {
    const user = await this.usersService.findUserByEmail(req.user.email);
    if (!user) {
      return null;
    }

    return await this.taskModel.create<Task>({
      ...data,
      completed: false,
      userId: req.user.id,
      deadline: moment().toISOString(),
    });
  }

  async updateTask(
    data: UpdateTaskDTO,
    req: any,
    param: UpdateTaskParams,
  ): Promise<any> {
    const [rowsUpdated] = await this.taskModel.update<Task>(
      { ...data },
      { where: { id: param.id, userId: req.user.id } },
    );
    if (rowsUpdated === 1) {
      return {
        type: 'success',
        error: null,
        data: {},
      };
    } else {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }
}
