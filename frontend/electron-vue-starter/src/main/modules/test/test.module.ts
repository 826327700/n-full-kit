import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
@Module({
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
