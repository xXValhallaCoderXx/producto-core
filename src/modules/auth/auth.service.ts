import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
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
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (isPasswordValid) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerAccount(data: RegisterUserDTO) {
    const hashedPassword = await this.hashPassword(data.password);

    const newUser = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });
    console.log('HASHED: ', newUser);
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
