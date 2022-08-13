import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { TaskModule } from './modules/task/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulerModule } from './modules/task-scheduler/task-scheduler.module';
// import { TaskGroupModule } from './modules/task-group/task-group.module';
import { CategoryModule } from './modules/categories/categories.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'producto',
      // sync: {
      //   force: true,
      // },
      synchronize: true,
      autoLoadModels: true,
    }),
    AuthModule,
    UsersModule,
    TaskModule,
    CategoryModule,
    TaskSchedulerModule,
  ],
})
export class AppModule {}
