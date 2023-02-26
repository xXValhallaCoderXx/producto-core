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
  MoveIncompleteDTO,
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
    const TODAY_START = moment(query.date).format('YYYY-MM-DD 00:00');
    const NOW = moment(query.date).format('YYYY-MM-DD 23:59');
    console.log('QUERY DATE: ', query);

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

  async create(data: CreateTaskDTO, req: any): Promise<any> {
    const user = await this.usersService.findUserByEmail(req.user.email);
    if (!user) {
      return null;
    }

    // @ts-ignore
    const autoMove = user.prefs?.autoMove ?? false;

    return await this.taskModel.create<Task>({
      ...data,
      completed: false,
      userId: req.user.id,
      deadline: moment(data.deadline).format('YYYY-MM-DD 23:59'),
      autoMove,
    });
  }

  moveIncompleteTasks = async (body: MoveIncompleteDTO, req: any) => {
    const TODAY_START = moment(body.from).format('YYYY-MM-DD 00:00');
    const NOW = moment(body.from).format('YYYY-MM-DD 23:59');
    await this.taskModel.update(
      { deadline: body.to },
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

  moveIncompleteTasks2 = async (body: MoveTasksDTO, req: any) => {
    await this.taskModel.update(
      { deadline: moment(body.to).format('YYYY-MM-DD 23:59'), autoMove: true },
      {
        where: {
          userId: req.user.id,
          id: body.tasks,
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

  @Cron(CronExpression.EVERY_30_MINUTES)
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
        const startOfDay = timeNow.clone().startOf('day');
        // const endOfDay = timeNow.clone().endOf('day');
        // const midnight = timeNow.clone().endOf('day').add('1', 'second');
        // const nextDeadline = timeNow.clone().add(1, 'day').endOf('day');
        // const fiveMinBeforeMidnight = midnight.clone().subtract(5, 'minutes');
        // const fiveMinAfterMidnight = midnight.clone().add(5, 'minutes');

        const tasks = await this.taskModel.findAll({
          where: {
            deadline: {
              [Op.lte]: startOfDay,
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
        if (taskIds.length > 0) {
          await this.taskModel.update(
            {
              deadline: moment(timeNow.format('YYYY-MM-DD')).format(
                'YYYY-MM-DD 23:59',
              ),
            },
            {
              where: {
                id: taskIds,
              },
            },
          );
        }
        // if (
        //   timeNow &&
        //   timeNow.isBetween(fiveMinBeforeMidnight, fiveMinAfterMidnight)
        // ) {
        //   const tasks = await this.taskModel.findAll({
        //     where: {
        //       deadline: {
        //         [Op.lte]: timeNow,
        //       },
        //       autoMove: true,
        //     },
        //     include: [
        //       {
        //         model: User,
        //         where: {
        //           timezone,
        //           prefs: {
        //             autoMove: true,
        //           },
        //         },
        //       },
        //     ],
        //   });

        //   const taskIds = tasks.map((task) => task.id);
        //   if (taskIds.length > 0) {
        //     await this.taskModel.update(
        //       {
        //         deadline: fiveMinAfterMidnight,
        //       },
        //       {
        //         where: {
        //           id: taskIds,
        //         },
        //       },
        //     );
        //   }
        // }
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

// timezones.forEach((timezone) => {
//   const tasks = await this.taskModel.findAll({
//     include: [{ model: User }],
//   });
//   // const now = moment().utc();
//   // console.log(now.tz(timezone).format('HH:mm:ss'));
//   // console.log(now.tz(timezone).format('mm'));

//   // const roundUp = now.startOf('hour').format('HH');
//   // console.log('ROUND UP: ', roundUp);

//   const now = moment();
// });
