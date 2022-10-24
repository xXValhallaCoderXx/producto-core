import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { AuthService } from '../auth/auth.service';
import { UpdateEmailDTO } from './user-auth.dto';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  public async updateUserEmail(userId: any, body: UpdateEmailDTO) {
    const user = await this.userService.findUserById(userId);
    await this.authService.verifySecret({
      hashed: user.password,
      plain: body.password.toString(),
    });

    const newTokens = await this.authService.getTokens(user.id, user.email);
    const hashedRefresh = await this.authService.hashSecret(
      newTokens.refreshToken,
    );
    user.email = body.email;
    user.refeshToken = hashedRefresh;

    await user.save();
    return {
      user: {
        id: user.id,
        email: user.email,
        prefs: user.prefs,
      },
      tokens: newTokens,
    };
  }
}
