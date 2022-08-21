import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    await user.destroy();
  }

  findUserByEmail(email: string): Promise<User> {
    const user = this.userModel.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async create(user: CreateUserDTO): Promise<User> {
    return await this.userModel.create<User>(user);
  }
}
