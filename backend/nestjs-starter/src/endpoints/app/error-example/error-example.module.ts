import { Module } from '@nestjs/common';
import { ErrorExampleService } from './error-example.service';
import { ErrorExampleController } from './error-example.controller';

@Module({
  controllers: [ErrorExampleController],
  providers: [ErrorExampleService],
})
export class ErrorExampleModule {}
