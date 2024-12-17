import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validationSchema } from './validation.schema';
import { appConfig, jwtConfig, mysqlConfig, mongodbConfig, redisConfig, lokiConfig } from './configuration';

@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: true, // 使配置模块在全局可用
			load: [appConfig, jwtConfig, mysqlConfig, mongodbConfig, redisConfig,lokiConfig],
			envFilePath: [
				`.env.${process.env.NODE_ENV || 'development'}`,
				'.env',
			],
			// validationSchema,
			validationOptions: {
				allowUnknown: true, // 允许未知的环境变量
				abortEarly: false, // 显示所有验证错误
			},
			expandVariables: true, // 允许环境变量中使用其他环境变量
		}),
	],
})
export class ConfigModule {}
