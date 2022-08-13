import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateStatusDTO {
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
