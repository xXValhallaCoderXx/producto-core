/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDTO, ToggleTaskCompleteDTO } from './task.dto';
import { UsersService } from 'src/modules/user/users.service';
import { Op } from 'sequelize';
import moment = require('moment');

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
    private usersService: UsersService,
  ) {}

  async findAll(req: any, query: any): Promise<Task[]> {
    const searchDate = moment(query.date).utc();
    console.log('SEARCH DATE: ', searchDate);
    const startDate = searchDate
      .subtract(2, 'days')
      .format('YYYY-MM-DD HH:mm:ss');
    const endDate = searchDate.add(2, 'days').format('YYYY-MM-DD HH:mm:ss');
    console.log('START DATE ', startDate);
    console.log('END DATE ', endDate);
    return this.taskModel.findAll({
      where: {
        userId: req.user.id,
        ...(query.date && {
          createdAt: {
            $between: ['2018-03-31T21:00:00.000Z', '2018-05-30T05:23:59.007Z'],
          },
        }),
      },
      attributes: ['title', 'completed', 'createdAt', 'id', 'focus'],
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
    const user = await this.usersService.findUserByEmail(req.user.email);
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
    const user = await this.usersService.findUserByEmail(req.user.email);
    if (!user) {
      return null;
    }

    const result = await this.taskModel.update<Task>(
      // @ts-ignore
      { ...data },
      { returning: true, where: { id: data.taskId, userId: req.user.userId } },
    );
    console.log(result[1].length === 0);
    if (result[1].length === 0) {
      return { success: false };
    }
    return result[1][0];
  }
}
