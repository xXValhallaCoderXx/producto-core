import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { User } from '../user/user.model';
import { TaskService } from '../task/task.service';
import { UpdatePerfsDTO } from './user-task.dto';

@Injectable()
export class UserTaskService {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UsersService,
  ) {}

  async updatePerfs(userId: any, body: UpdatePerfsDTO): Promise<User> {
    const user = await this.userService.findUserById(userId);
    user.prefs = {
      ...user.prefs,
      ...body,
    };

    await user.save();

    if (body.autoMove === false) {
      // Turn off automove for user tasks
      await this.taskService.toggleAllTasksAutomove(userId, false);
    }
    return user;
  }
}
