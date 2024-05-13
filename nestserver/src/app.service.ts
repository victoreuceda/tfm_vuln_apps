import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  reflectInput(input: string): string {
    return `Input was: ${input}`;
  }
}
