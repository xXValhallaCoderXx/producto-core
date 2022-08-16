import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class ToggleTaskCompleteDTO {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsBoolean()
  focus?: boolean;

  @IsNotEmpty()
  @IsNumber()
  taskId: number;
}

export class UpdateStatusDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

// export class GetUserTasks {
//   // @IsNotEmpty()
//   // @IsNumber()
//   // userId: string;

//   // @IsArray()
//   // categories?: string[];

//   // @IsArray()
//   // status?: boolean;
// }
