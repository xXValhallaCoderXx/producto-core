import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class ToggleTaskCompleteDTO {
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

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
