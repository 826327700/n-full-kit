import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RedisExampleModule } from './redis-example/redis-example.module';
import { ErrorExampleModule } from './error-example/error-example.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';

@Module({
	imports: [
		UsersModule,
		// RedisExampleModule,
		// ErrorExampleModule,
		// RateLimitModule,
	],
})
export class AppModule {

}
