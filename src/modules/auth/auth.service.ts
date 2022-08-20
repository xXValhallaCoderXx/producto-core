import * as bcrypt from 'bcrypt';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/modules/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDTO } from './auth.dto';
import { CreateUserDTO } from '../user/user.dto';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: CreateUserDTO): Promise<any | null> {
    const user = await this.usersService.findUserByEmail(data.email);
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

  async login(user: User) {
    const { id, email } = user;
    const payload = { email, sub: id };
    return {
      access_token: this.jwtService.sign(payload)
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
      throw new BadRequestException('Email has already been registered');
    }
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
