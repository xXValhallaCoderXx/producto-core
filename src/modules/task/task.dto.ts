import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  deadline: string;
}

export class UpdateTaskParams {
  @IsNotEmpty()
  id: string;
}

export class FetchTasksParams {
  @IsDateString()
  date: string;
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
  @IsDateString()
  deadline: string;
}

export class FindOneParams {
  @IsNumberString()
  id: string;
}

export class MoveIncompleteDTO {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}
