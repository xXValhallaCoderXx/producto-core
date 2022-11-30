import * as bcrypt from 'bcrypt';
import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDTO } from './auth.dto';
import { CreateUserDTO } from '../user/user.dto';
import { User } from '../user/user.model';
import { PostgresErrorCode } from 'src/exceptions/db-exceptions';
import { InvalidCredentials } from 'src/exceptions/api-exceptions';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
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
    return { accessToken, refreshToken };
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
}
