import * as bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDTO, UpdatePasswordDTO } from './user.dto';
import {
  InvalidCredentials,
  RecordNotFound,
} from 'src/exceptions/api-exceptions';
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
        email: email.toLowerCase(),
      },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  findUserById(id: string): Promise<User> {
    const user = this.userModel.findOne({
      where: {
        id,
      },
      attributes: ['id', 'email', 'prefs', "password"],
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async create(user: CreateUserDTO): Promise<User> {
    return await this.userModel.create<User>({
      ...user,
      email: user.email.toLowerCase(),
      prefs: {
        autoMove: false,
      },
    });
  }

  async updatePerfs(userId: any, body: any): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
      attributes: ['id', 'email', 'prefs'],
    });
    user.prefs = {
      ...user.prefs,
      ...body,
    };

    await user.save();
    return user;
  }

  private async verifyPassword(plainPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new InvalidCredentials();
    }
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async updatePassword(userId: any, body: UpdatePasswordDTO): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
    });

    await this.verifyPassword(body.oldPassword.toString(), user.password);
    const hashedPassword = await this.hashPassword(body.newPassword.toString());
    user.password = hashedPassword;
    await user.save();
    return user;
  }

  // private async getTokens(userId: string, email: string) {
  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.jwtService.signAsync(
  //       {
  //         sub: userId,
  //         email,
  //       },
  //       {
  //         secret: this.configService.get<string>('JWT_SECRET'),
  //         expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRY'),
  //       },
  //     ),
  //     this.jwtService.signAsync(
  //       {
  //         sub: userId,
  //         email,
  //       },
  //       {
  //         secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
  //         expiresIn: this.configService.get<string>('JWT_REFRESH_SECRET'),
  //       },
  //     ),
  //   ]);

  //   return { accessToken, refreshToken };
  // }

  async updateRefreshToken({ userId, plainToken }): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new RecordNotFound('User not found');
    }
    const hashedToken = await this.hashPassword(plainToken);
    user.refeshToken = hashedToken;
    await user.save();
    return user;
  }
}
