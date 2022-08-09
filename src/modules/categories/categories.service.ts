import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './categories.model';
import { FindAllDto } from './categories.dto';
import { UsersService } from 'src/modules/user/users.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
    private usersService: UsersService,
  ) {}

  async findAll(params: FindAllDto): Promise<any[]> {
    return this.categoryModel.findAll({
      where: {
        userId: params.id,
      },
    });
  }

  //   async remove(id: number): Promise<void> {
  //     const task = await this.findOne(id);
  //     await task.destroy();
  //   }

  //   findOne(id: number): Promise<Task> {
  //     return this.taskModel.findOne({
  //       where: {
  //         id,
  //       },
  //     });
  //   }

  //   async create(data: CreateTaskDTO, req: any): Promise<Task> {
  //     console.log('REQ: ', req.user);
  //     const user = await this.usersService.findOne(req.user.username);
  //     if (!user) {
  //       return null;
  //     }

  //     return await this.taskModel.create<Task>({
  //       ...data,
  //       completed: 'false',
  //       status: 'pending',
  //       userId: req.user.userId,
  //     });
  //   }

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
