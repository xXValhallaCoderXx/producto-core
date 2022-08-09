import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './categories.model';
import { CreateCategoryDTO, UpdateStatusDTO } from './categories.dto';
import { UsersService } from 'src/modules/user/users.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<any[]> {
    return this.categoryModel.findAll({
      where: {
        userId: 1,
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

  async create(data: CreateCategoryDTO, req: any): Promise<Category> {
    try {
      return await this.categoryModel.create<Category>({
        ...data,
        active: true,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Error creating category');
    }
  }

  async updateStatus(data: UpdateStatusDTO, req: any): Promise<any> {
    try {
      const result = await this.categoryModel.update<Category>(
        { active: data.active },
        { returning: true, where: { id: data.categoryId } },
      );
      return result[1][0];
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Error updating category');
    }
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
