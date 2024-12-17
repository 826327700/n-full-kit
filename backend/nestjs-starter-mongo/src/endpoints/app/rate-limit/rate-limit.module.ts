import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { RateLimitController } from './rate-limit.controller';

@Module({
  controllers: [RateLimitController],
  providers: [RateLimitService],
})
export class RateLimitModule {}
