import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';

@Module({
  controllers: [UserProfileController],
  imports: [AuthModule, UsersModule],
  providers: [UserProfileService],
})
export class UserProfileModule {}
