import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { UsersModule } from 'src/modules/users/users.module';
// import { LocalStrategy } from './local.strategy';
// import { JwtStrategy } from './jwt.strategy';
import { TaskGroupController } from './task-group.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskGroup } from './task-group.model';

@Module({
  imports: [SequelizeModule.forFeature([TaskGroup])],
  controllers: [TaskGroupController],
  //   providers: [AuthService, LocalStrategy, JwtStrategy],
  //   exports: [AuthService],
})
export class TaskGroupModule {}
