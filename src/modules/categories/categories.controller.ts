import { Controller, Request, UseGuards, Post, Body } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { CreateCategoryDTO } from './categories.dto';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('')
  getCategories(@Body() createCategoryDTO: CreateCategoryDTO) {
    return 'Hello world';
  }

  // @Get('')
  // toggleCategory(@Request() req) {
  //   return this.categoryService.findAll({ id: '1' });
  // }
}
