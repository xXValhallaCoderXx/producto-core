import { Module } from '@nestjs/common';
import { CategoryController } from './categories.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './categories.model';
import { CategoryService } from './categories.service';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Category]), UsersModule],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [SequelizeModule],
})
export class CategoryModule {}
