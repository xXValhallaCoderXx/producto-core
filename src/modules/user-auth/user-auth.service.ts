import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { AuthService } from '../auth/auth.service';
import { TaskService } from '../task/task.service';
import { UpdateEmailDTO } from './user-auth.dto';
import { User } from '../user/user.model';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly taskService: TaskService,
  ) {}

  public async updateUserEmail(userId: any, body: UpdateEmailDTO) {
    const user = await this.userService.findUserById(userId);
    await this.authService.verifySecret({
      hashed: user.password,
      plain: body.password.toString(),
    });

    const newTokens = await this.authService.getTokens(user.id, body.email);
    const hashedRefresh = await this.authService.hashSecret(
      newTokens.refreshToken,
    );

    await User.update(
      { email: body.email, refeshToken: hashedRefresh },
      {
        where: {
          id: userId,
        },
      },
    );

    return {
      tokens: newTokens,
    };
  }

  public async deleteUserAccount(userId: any) {
    const user = await this.userService.findUserById(userId);
    const deletedTasks = await this.taskService.deleteAll(userId);
    const deletedUser = await this.userService.deleteUser(userId);

    return true;
  }
}
