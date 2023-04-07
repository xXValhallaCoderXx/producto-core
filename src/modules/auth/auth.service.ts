import * as bcrypt from 'bcrypt';
import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/user/users.service';
import { TaskService } from '../task/task.service';
import { JwtService } from '@nestjs/jwt';
import {
  AuthUserDTO,
  OtpRequestDTO,
  OtpVerifyDTO,
  ForgotPasswordUpdate,
} from './auth.dto';
import { CreateUserDTO } from '../user/user.dto';
import { User } from '../user/user.model';
import { PostgresErrorCode } from 'src/exceptions/db-exceptions';
import { InvalidCredentials } from 'src/exceptions/api-exceptions';

import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private taskService: TaskService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(data: CreateUserDTO): Promise<any | null> {
    try {
      const user = await this.usersService.findUserByEmail(data.email);
      await this.verifySecret({
        hashed: user.password,
        plain: data.password,
      });
      return user;
    } catch {
      throw new InvalidCredentials();
    }
  }

  async login(user: User) {
    const { id, email } = user;
    const { accessToken, refreshToken } = await this.getTokens(id, email);

    if (!accessToken || !refreshToken) {
      console.log('Error getting keys');
    }
    await this.usersService.updateRefreshToken({
      userId: id,
      plainToken: refreshToken,
    });
    return { accessToken, refreshToken, email };
  }

  async logout(user) {
    const { sub } = user;
    await this.usersService.updateRefreshToken({
      userId: sub,
      plainToken: '',
    });
    return { status: 'ok' };
  }

  async refreshJwt(req: any) {
    const { email, sub: userId, refreshToken } = req;
    const user = await this.usersService.findUserByEmail(email);
    await this.verifySecret({
      hashed: user.refeshToken,
      plain: refreshToken,
    });
    const newTokens = await this.getTokens(userId, email);
    await this.usersService.updateRefreshToken({
      userId,
      plainToken: newTokens.refreshToken,
    });
    return newTokens;
  }

  async registerAccount(data: AuthUserDTO) {
    const hashedPassword = await this.hashSecret(data.password);

    try {
      const newUser = await this.usersService.create({
        ...data,
        password: hashedPassword,
      });

      const newTokens = await this.getTokens(newUser.id, newUser.email);
      await this.usersService.updateRefreshToken({
        userId: newUser.id,
        plainToken: newTokens.refreshToken,
      });

      await this.taskService.createNewUserTasks(newUser.email);

      return {
        type: 'success',
        error: null,
        data: {
          id: newUser.id,
          email: newUser.email,
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        },
      };
    } catch (err) {
      if (err.parent.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmail(email) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException("Couldn't find your account");
    }
    return true;
  }

  public async hashSecret(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  public async verifySecret({ hashed, plain }) {
    const isPasswordMatching = await bcrypt.compare(plain, hashed);

    if (!isPasswordMatching) {
      throw new InvalidCredentials();
    }
  }

  public async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRY'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  public async otpRequest(data: OtpRequestDTO) {
    const user = await this.usersService.createUserOTP({
      email: data.email,
      otpCode: [...Array(6)].map((_) => (Math.random() * 10) | 0).join(''),
    });

    if (user) {
      console.log('USER EXISTS SEND EMAIL');
    }

    return true;
  }

  public async otpUpdatePassword(userCreds, data: ForgotPasswordUpdate) {
    const user = await this.usersService.findUserById(userCreds.id);

    const hashedPassword = await this.hashSecret(data.newPassword);

    user.password = hashedPassword;
    await user.save();

    const newTokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateRefreshToken({
      userId: user.id,
      plainToken: newTokens.refreshToken,
    });

    return {
      type: 'success',
      error: null,
      data: {
        id: user.id,
        email: user.email,
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      },
    };
  }

  public async otpVerify(data: OtpVerifyDTO) {
    const user = await this.usersService.findUserByEmail(data.email);

    if (!user) {
      throw new BadRequestException('Incorrect credentials');
    }
    if (user.otpCode === data.code) {
      // Check credentials
      const timeNow = moment().utc(false);
      const otpExpiry = moment(user.otpExpiry).utc(false);

      if (timeNow.isSameOrBefore(otpExpiry)) {
        const { accessToken } = await this.getTokens(user.id, user.email);
        user.otpCode = '';
        user.otpExpiry = null;
        await user.save();
        return { accessToken };
      } else {
        throw new BadRequestException('Expired Code');
      }
    } else {
      throw new BadRequestException('Incorrect credentials');
    }
  }
}
