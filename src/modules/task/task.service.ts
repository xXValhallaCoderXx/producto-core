import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDTO } from './task.dto';
import { UsersService } from 'src/modules/user/users.service';
@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.findAll();
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
    console.log('REQ: ', req.user);
    const user = await this.usersService.findOne(req.user.username);
    if (!user) {
      return null;
    }

    return await this.taskModel.create<Task>({
      ...data,
      completed: 'false',
      status: 'pending',
      userId: req.user.userId,
    });
  }

  //   async update(user: CreateTaskDTO): Promise<Task> {
  //     const task = await this.findOne(1);
  //     if (task) {
  //     } else {
  //     }
  //     // return await this.taskModel.create<Task>({
  //     //   ...user,
  //     //   completed: 'false',
  //     //   status: 'pending',
  //     // });
  //   }
}
