import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { TaskModule } from './modules/task/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      sync: {
        force: true,
      },
      synchronize: true,
      autoLoadModels: true,
      dialectOptions: {
        ...(process.env.NODE_ENV !== 'develop' && {
          ssl: {
            rejectUnauthorized: false,
          },
        }),
      },
    }),
    AuthModule,
    UsersModule,
    TaskModule,
  ],
})
export class AppModule {}
