/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel, SequelizeModule } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Task } from './task.model';
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  UpdateTaskParams,
  MoveIncompleteDTO,
} from './task.dto';
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
    const TODAY_START = moment(query.date).format('YYYY-MM-DD 00:00');
    const NOW = moment(query.date).format('YYYY-MM-DD 23:59');
    return this.taskModel.findAll({
      where: {
        userId: req.user.id,
        ...(query.date && {
          deadline: {
            [Op.between]: [TODAY_START, NOW],
          },
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

  async findAllIncompleteTasks(req: any): Promise<string[]> {
    const incompleteDates = await this.taskModel.findAll({
      where: {
        userId: req.user.id,
        completed: false,
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
    const incompleteTasksOn = [
      ...new Set(
        incompleteDates.map((item) =>
          moment(item.deadline).format('YYYY-MM-DD'),
        ),
      ),
    ];

    return incompleteTasksOn;
  }

  async findAllIncompleteDetailTasks(req: any): Promise<any[]> {

    const incompleteDates = await this.taskModel.findAll({
      where: {
        userId: req.user.id,
        completed: false,
      },
      order: [['deadline', 'ASC']],
      attributes: [
        'title',
        'completed',
        'createdAt',
        'id',
        'focus',
        'deadline',
      ],
    });

    return incompleteDates;
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

  async create(data: CreateTaskDTO, req: any): Promise<any> {
    const user = await this.usersService.findUserByEmail(req.user.email);
    if (!user) {
      return null;
    }
    console.log('WHAT IS THAT: ', data);
    console.log('DEADLINE: ', data.deadline);
    return await this.taskModel.create<Task>({
      ...data,
      completed: false,
      userId: req.user.id,
      deadline: data.deadline,
    });
  }

  moveIncompleteTasks = async (body: MoveIncompleteDTO, req: any) => {
    const TODAY_START = moment(body.date).format('YYYY-MM-DD 00:00');
    const NOW = moment(body.date).format('YYYY-MM-DD 23:59');
    await this.taskModel.update(
      { deadline: moment(new Date()).format('YYYY-MM-DD') },
      {
        where: {
          userId: req.user.id,
          deadline: {
            [Op.between]: [TODAY_START, NOW],
          },
          completed: false,
        },
      },
    );

    return {
      type: 'success',
      error: null,
      data: {},
    };
  };

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
