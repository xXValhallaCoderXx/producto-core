import { Controller, Request, Get } from '@nestjs/common';
// import { AuthService } from './auth.service';

@Controller('task-group')
export class TaskGroupController {
  //   constructor(private authService: AuthService) {}

  @Get('')
  async allTaskGroups(@Request() req) {
    return 'Hello';
  }
}
