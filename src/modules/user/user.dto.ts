import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  isEmail,
  IsEmail,
  IsString,
} from 'class-validator';

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

export class UpdateTimezoneDTO {
  @IsString()
  timezone: string;
}

export class UpdatePasswordDTO {
  @IsNotEmpty({ message: 'Current password must not be empty' })
  currentPassword: string;

  @IsNotEmpty({ message: 'New password must not be empty' })
  newPassword: string;
}
