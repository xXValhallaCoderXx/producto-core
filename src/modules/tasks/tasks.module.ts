import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { UsersModule } from 'src/modules/users/users.module';
// import { LocalStrategy } from './local.strategy';
// import { JwtStrategy } from './jwt.strategy';
import { TaskController } from './task.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './tasks.model';

@Module({
  imports: [SequelizeModule.forFeature([Task])],
  controllers: [TaskController],
  //   providers: [AuthService, LocalStrategy, JwtStrategy],
  //   exports: [AuthService],
})
export class TaskModule {}
