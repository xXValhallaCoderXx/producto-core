import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDTO } from './auto.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user) {
      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (isPasswordValid) {
        const { password, ...rest } = user;
        return rest;
      }
    }

    return null;
  }

  async login(user: any) {
    const { id, username } = user.dataValues;
    const payload = { username: username, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerAccount(data: RegisterUserDTO) {
    console.log('REGISTER ACCOUNT: ', data);
    const hashedPassword = await this.hashPassword(data.password);

    try {
      const newUser = await this.usersService.create({
        ...data,
        password: hashedPassword,
      });
      console.log('HASHED: ', newUser);

      return {
        user: 'ok',
      };
    } catch (err) {
      console.log('Error', err);
      return {
        error: 'sdsd',
      };
    }
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
