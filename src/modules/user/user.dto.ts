import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UpdatePerfsDTO {
  @IsOptional()
  @IsBoolean()
  autoMove: boolean;
}
