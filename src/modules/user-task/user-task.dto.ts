import { IsOptional, IsBoolean } from 'class-validator';

export class UpdatePerfsDTO {
  @IsOptional()
  @IsBoolean()
  autoMove: boolean;
}
