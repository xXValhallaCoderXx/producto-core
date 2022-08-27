import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty()
  @IsString()
  title: string;
}

export class UpdateTaskParams {
  @IsNotEmpty()
  id: string;
}

export class UpdateTaskDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  completed: boolean;

  @IsOptional()
  @IsBoolean()
  focus: boolean;

  @IsOptional()
  @IsString()
  deadline: string;
}

export class FindOneParams {
  @IsNumberString()
  id: string;
}

export class MoveIncompleteDTO {
  @IsString()
  date: string;
}
