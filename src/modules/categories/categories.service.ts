import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './categories.model';
import { CreateCategoryDTO, UpdateStatusDTO } from './categories.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async findAll(req: any): Promise<any> {
    const results = await this.categoryModel.findAll({
      where: {
        userId: req.user.userId,
      },
    });
    return {
      status: 'success',
      data: results,
      error: null,
    };
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
        userId: req.user.userId,
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
