import { Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { AdminModule } from './admin/admin.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		ThrottlerModule.forRoot([{
			ttl: 60000, // 1分钟
			limit: 10,  // 最多10个请求
		}]),
		AppModule,
		AdminModule,
	],
	providers: [
		// 如果想开启全局限流 请取消此注释
		// {
		// 	provide: APP_GUARD,
		// 	useClass: ThrottlerGuard,
		// },
	],
})
export class EndpointsModule { }