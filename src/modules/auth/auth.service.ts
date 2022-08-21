import * as bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/modules/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDTO } from './auth.dto';
import { CreateUserDTO } from '../user/user.dto';
import { User } from '../user/user.model';
import { PostgresErrorCode } from 'src/exceptions/db-exceptions';
import { InvalidCredentials } from 'src/exceptions/api-exceptions';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: CreateUserDTO): Promise<any | null> {
    try {
      const user = await this.usersService.findUserByEmail(data.email);
      await this.verifyPassword(data.password, user.password);
      user.password = undefined;
      return user;
    } catch {
      throw new InvalidCredentials();
    }
  }

  async login(user: User) {
    const { id, email } = user;
    const payload = { email, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerAccount(data: AuthUserDTO) {
    const hashedPassword = await this.hashPassword(data.password);

    try {
      const newUser = await this.usersService.create({
        ...data,
        password: hashedPassword,
      });

      return {
        type: 'success',
        error: null,
        data: {
          id: newUser.id,
          email: newUser.email,
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

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
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
}
