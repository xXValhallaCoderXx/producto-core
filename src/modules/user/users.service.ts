import * as bcrypt from 'bcrypt';
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from './user.model';
import { CreateUserDTO, UpdatePasswordDTO } from './user.dto';
import {
  InvalidCredentials,
  RecordNotFound,
} from 'src/exceptions/api-exceptions';
import * as moment from 'moment-timezone';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(opts: any): Promise<User[]> {
    return this.userModel.findAll(opts);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    await user.destroy();
  }

  findUserByEmail(email: string): Promise<User> {
    const user = this.userModel.findOne({
      where: {
        email: {
          [Op.iLike]: email,
        },
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
      attributes: ['id', 'email', 'prefs', 'password'],
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

  async updateTimezone(userId: any, body: any): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
      attributes: ['id', 'email', 'prefs', 'timezone'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.timezone = body.timezone;
    await user.save();

    return user;
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

    if (body.autoMove === false) {
      // Turn off automove for user tasks
      console.log('TIME TO TURN OFF AUTOMOVE ON TASKS');
    }
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

    await this.verifyPassword(body.currentPassword.toString(), user.password);
    const hashedPassword = await this.hashPassword(body.newPassword.toString());
    user.password = hashedPassword;
    await user.save();
    return user;
  }

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

  async createUserOTP({ email, otpCode }): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const timeNow = moment.utc();
    const fiveMinutesNow = timeNow.utc(false).add(5, 'minutes').format();

    user.otpCode = otpCode;
    user.otpExpiry = fiveMinutesNow;

    await user.save();
    return user;
  }
}
