import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { AuthService } from '../auth/auth.service';
import { UpdateEmailDTO } from './user-auth.dto';
import { User } from '../user/user.model';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  public async updateUserEmail(userId: any, body: UpdateEmailDTO) {
    console.log('BODY', body);
    console.log('USER ID: ', userId);
    const user = await this.userService.findUserById(userId);
    console.log('HASHED: ', user.id);
    await this.authService.verifySecret({
      hashed: user.password,
      plain: body.password.toString(),
    });

    console.log('WHAT: ');
    const newTokens = await this.authService.getTokens(user.id, user.email);
    const hashedRefresh = await this.authService.hashSecret(
      newTokens.refreshToken,
    );
    console.log('WOWOWOO');
    // user.email = body.email;
    // user.refeshToken = hashedRefresh;

    await User.update(
      { email: body.email, refeshToken: hashedRefresh },
      {
        where: {
          id: userId,
        },
      },
    );

    // await user.save();
    return {
      // user: {
      //   id: user.id,
      //   email: body.email,
      //   prefs: user.prefs,
      // },
      tokens: newTokens,
    };
  }
}
