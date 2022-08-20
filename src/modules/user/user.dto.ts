import { IsNotEmpty, isEmail } from 'class-validator';
export class CreateUserDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
