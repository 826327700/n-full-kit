import { DynamicModule, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongoUsersModule } from './mongo-users/mongo-users.module';
import { RedisExampleModule } from './redis-example/redis-example.module';
import { ErrorExampleModule } from './error-example/error-example.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';

@Module({})
export class AppModule {
  static register(options: { useMongoDB: boolean }): DynamicModule {
    const userModule = options.useMongoDB ? MongoUsersModule : UsersModule;
    return {
        module: AppModule,
        imports: [
            userModule,
            RedisExampleModule,
            ErrorExampleModule,
            RateLimitModule,
        ],
    };
}
}
