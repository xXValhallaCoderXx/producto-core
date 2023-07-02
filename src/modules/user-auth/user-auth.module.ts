import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { TaskModule } from '../task/tasks.module';
import { UserProfileController } from './user-auth.controller';
import { UserProfileService } from './user-auth.service';

@Module({
  controllers: [UserProfileController],
  imports: [AuthModule, UsersModule, TaskModule],
  providers: [UserProfileService],
})
export class UserProfileModule {}
