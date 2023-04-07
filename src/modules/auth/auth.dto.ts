import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsNumberString,
  MaxLength,
  IsString,
  IsOptional,
} from 'class-validator';

export class AuthUserDTO {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
  password: string;

  @IsOptional()
  @IsString()
  timezone: string;
}

export class VerifyEmailParams {
  @IsString()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}

export class UpdateEmailDTO {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class OtpRequestDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class OtpVerifyDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  code: string;
}

export class ForgotPasswordUpdate {
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
