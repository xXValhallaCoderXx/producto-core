import { Controller, Request, Get } from '@nestjs/common';
// import { AuthService } from './auth.service';

@Controller('task')
export class TaskController {
  //   constructor(private authService: AuthService) {}

  @Get('')
  async allTasks(@Request() req) {
    return 'Hello';
  }
}
