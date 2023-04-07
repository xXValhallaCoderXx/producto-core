import { Module } from '@nestjs/common';
import { TaskModule } from '../task/tasks.module';
import { UsersModule } from '../user/users.module';
import { UserTasksController } from './user-task.controller';
import { UserTaskService } from './user-task.service';

@Module({
  controllers: [UserTasksController],
  imports: [TaskModule, UsersModule],
  providers: [UserTaskService],
})
export class UserTaskModule {}
