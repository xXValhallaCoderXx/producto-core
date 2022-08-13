import * as bcrypt from 'bcrypt';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/modules/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDTO } from './auto.dto';
import { CreateUserDTO } from '../user/user.dto';
import { User } from '../user/user.model';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: CreateUserDTO): Promise<any> {
    const user = await this.usersService.findOne(data.username);

    if (user) {
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (isPasswordValid) {
        const { password, ...rest } = user;
        return rest;
      }
    }

    return null;
  }

  async login(data: any, user: any) {
    const { id, username } = user.dataValues;
    const payload = { username: username, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerAccount(data: RegisterUserDTO) {
    const hashedPassword = await this.hashPassword(data.password);

    try {
      const newUser = await this.usersService.create({
        ...data,
        password: hashedPassword,
      });

      return {
        type: 'success',
        data: {
          id: newUser.id,
          username: newUser.username,
        },
        error: null,
      };
    } catch (err) {
      throw new BadRequestException('Username already registered');
    }
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
