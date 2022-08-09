import {
  Controller,
  Request,
  UseGuards,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import { CategoryService } from './categories.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { CreateCategoryDTO, UpdateStatusDTO } from './categories.dto';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  toggleCategory(@Request() req) {
    return this.categoryService.findAll(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  getCategories(@Body() createCategoryDTO: CreateCategoryDTO, @Request() req) {
    return this.categoryService.create(createCategoryDTO, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update')
  updateStatus(@Body() updateStatusDTO: UpdateStatusDTO, @Request() req) {
    return this.categoryService.updateStatus(updateStatusDTO, req);
  }
}
