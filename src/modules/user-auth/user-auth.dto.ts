import { IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateEmailDTO {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
