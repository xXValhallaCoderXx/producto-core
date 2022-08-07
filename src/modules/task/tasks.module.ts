import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
// import { UsersModule } from 'src/modules/users/users.module';
// import { LocalStrategy } from './local.strategy';
// import { JwtStrategy } from './jwt.strategy';
import { TaskController } from './task.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';

@Module({
  imports: [SequelizeModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService],
  //   exports: [AuthService],
})
export class TaskModule {}
