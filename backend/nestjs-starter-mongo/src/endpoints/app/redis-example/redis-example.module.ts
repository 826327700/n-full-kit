import { Module } from '@nestjs/common';
import { RedisExampleService } from './redis-example.service';
import { RedisExampleController } from './redis-example.controller';

@Module({
    controllers: [RedisExampleController],
    providers: [RedisExampleService],
})
export class RedisExampleModule {}
