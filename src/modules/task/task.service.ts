/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import Sequelize, { Op } from 'sequelize';
import { Task } from './task.model';
import * as moment from 'moment-timezone';

import {
  CreateTaskDTO,
  UpdateTaskDTO,
  UpdateTaskParams,
  MoveTasksDTO,
} from './task.dto';
import { UsersService } from 'src/modules/user/users.service';
import { User } from '../user/user.model';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
    private usersService: UsersService,
  ) {}

  async findAll(req: any, query: any): Promise<Task[]> {
    const tasks = await this.taskModel.findAll({
      where: {
        userId: req.user.id,
        ...(query.start &&
          query.end && {
            deadline: { [Op.between]: [query.start, query.end] },
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
    return tasks;
  }

  async deleteAll(userId: any): Promise<number> {
    const tasks = await this.taskModel.destroy({
      where: {
        userId,
      },
    });
    return tasks;
  }

  async create(data: CreateTaskDTO, req: any): Promise<any> {
    const user = await this.usersService.findUserByEmail(req.user.email);
    const timeNow = moment().tz(user.timezone);
    if (!user) {
      return null;
    }
    // @ts-ignore
    const autoMove = user.prefs?.autoMove ?? false;

    return await this.taskModel.create<Task>({
      ...data,
      completed: false,
      userId: req.user.id,
      deadline: String(timeNow),
      autoMove,
    });
  }

  async createNewUserTasks(email: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const timeNow = moment().tz(user.timezone);

    await this.taskModel.bulkCreate<Task>([
      {
        title: 'Tap a task to mark it as complete',
        completed: false,
        userId: user.id,
        deadline: String(timeNow),
        autoMove: false,
      },
      {
        title: 'Press and hold to edit',
        completed: false,
        userId: user.id,
        deadline: String(timeNow),
        autoMove: false,
      },
      {
        title: 'Tap elsewhere to dismiss keyboard',
        completed: false,
        userId: user.id,
        deadline: String(timeNow),
        autoMove: false,
      },
    ]);
  }

  moveSpecificTasksToToday = async (body: MoveTasksDTO, req: any) => {
    const user = await this.usersService.findUserByEmail(req.user.email);
    const timeNow = moment().tz(user.timezone);
    const tasks = await this.taskModel.findAll({
      where: { id: body.tasks, completed: false },
    });

    tasks.forEach(async (task) => {
      const newDeadline = moment(timeNow);
      task.deadline = String(newDeadline);
      await task.save();
    });

    return {
      type: 'success',
      error: null,
      data: {},
    };
  };

  // NOT YET CHANGED

  async findAllIncompleteTasks(req: any): Promise<string[]> {
    const user = await this.usersService.findUserById(req.user.id);
    const timezone = user.timezone;

    const incompleteDates = await this.taskModel.findAll({
      where: {
        userId: req.user.id,
        completed: false,
        deadline: {
          [Op.lt]: new Date(),
        },
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
          moment(item.deadline).tz(timezone).format('YYYY-MM-DD'),
        ),
      ),
    ];
    return incompleteTasksOn;
  }

  async findAllIncompleteDetailTasks(req: any, query: any): Promise<any[]> {
    const TODAY_START = moment(query.date).format('YYYY-MM-DD 00:00');
    const NOW = moment(query.date).format('YYYY-MM-DD 23:59');
    const incompleteDates = await this.taskModel.findAll({
      where: {
        userId: req.user.id,
        completed: false,
        ...(query.date && {
          deadline: {
            [Op.between]: [TODAY_START, NOW],
          },
        }),
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

  async deleteTask(req: any, param: UpdateTaskParams): Promise<any> {
    const rowsUpdated = await this.taskModel.destroy({
      where: {
        id: param.id,
      },
    });
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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async autoMoveTasks() {
    const uniqueTimezones = await this.usersService.findAll({
      where: {
        timezone: {
          [Op.ne]: null,
        },
      },
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('timezone')), 'timezone'],
      ],
    });

    const timezones = uniqueTimezones.map((user) => user.timezone);

    if (timezones.length > 0) {
      for await (const timezone of timezones) {
        const timeNow = moment().tz(timezone);
        const startBase = timeNow.clone();
        const endOfCurrentDay = startBase.endOf('day');

        const tasks = await this.taskModel.findAll({
          where: {
            deadline: {
              [Op.lte]: endOfCurrentDay,
            },
            autoMove: true,
          },
          include: [
            {
              model: User,
              where: {
                timezone,
                prefs: {
                  autoMove: true,
                },
              },
            },
          ],
        });

        const taskIds = tasks.map((task) => task.id);
        // console.log('BATCH START');
        if (taskIds.length > 0) {
          tasks.forEach(async (task, index) => {
            const dateToCheck = moment(task.deadline).tz(timezone);
            const referenceDate = moment(timeNow);

            const isDayBefore = dateToCheck.isSame(
              referenceDate.subtract(1, 'day'),
              'day',
            );

            if (isDayBefore) {
              // console.log('INDEX: ', index);
              // console.log('The date is the day before the reference date.');

              // console.log('TITLE: ', task.title);
              // console.log('TIME NOW: ', timeNow);
              // console.log('dateToCheck: ', dateToCheck);
              // console.log('referenceDate: ', referenceDate);
              const newDeadline = moment(task.deadline).add(1, 'days');

              // console.log('NEW DATE: ', newDeadline);
              task.deadline = String(newDeadline);
              await task.save();
            } else {
              console.log('The date is not the day before the reference date.');
            }
          });
        }
        // console.log('BATCH ENDED');
      }
    } else {
      this.logger.debug('No timezones found');
    }
  }

  async toggleAllTasksAutomove(userId: any, autoMove: boolean): Promise<any> {
    const updatedTasks = await this.taskModel.update(
      {
        autoMove: false,
      },
      {
        where: {
          userId,
          autoMove: true,
        },
      },
    );
    if (updatedTasks.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
