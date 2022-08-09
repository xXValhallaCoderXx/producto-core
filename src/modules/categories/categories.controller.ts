import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('valid')
  getProfile(@Request() req) {
    return this.categoryService.findAll({ id: '1' });
  }
}
