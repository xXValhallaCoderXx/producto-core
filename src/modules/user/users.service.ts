import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDTO } from './user.dto';
// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  findOne(email: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        email,
      },
    });
  }

  // async create(data): Promise<User> {
  //   return await this.userModel.create<User>(data);
  // }
  async create(user: CreateUserDTO): Promise<User> {
    return await this.userModel.create<User>(user);
  }

  // async findOne(username: string): Promise<LocalUsers | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }
}
