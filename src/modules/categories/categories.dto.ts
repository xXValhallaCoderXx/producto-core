import { IsEmail, IsNotEmpty } from 'class-validator';
export class FindAllDto {
  readonly id?: string;
}

export class CreateCategoryDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
