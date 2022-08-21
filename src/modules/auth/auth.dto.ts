import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class AuthUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
  password: string;
}
