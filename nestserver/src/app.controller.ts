import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/reflect')
  reflectInput(@Query('input') input: string): string {
    return this.appService.reflectInput(input);
  }
}
