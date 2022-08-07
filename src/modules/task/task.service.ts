import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDTO } from './task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
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

  async create(user: CreateTaskDTO): Promise<Task> {
    return new Promise((res) => {
      return res(null);
    });
    // return await this.taskModel.create<Task>({
    //   ...user,
    //   completed: 'false',
    //   status: 'pending',
    // });
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
