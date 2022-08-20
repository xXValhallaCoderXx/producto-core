import { IsNotEmpty, IsEmail, Min, Max } from 'class-validator';

export class AuthUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  // @Min(6)
  // @Max(15)
  password: string;
}
