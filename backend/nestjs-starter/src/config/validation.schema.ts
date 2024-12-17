import * as Joi from 'joi';

export const validationSchema = Joi.object({
	// 应用配置验证
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test')
		.default('development'),
	PORT: Joi.number().default(3000),
	APP_NAME: Joi.string().default('NestJS API'),
	APP_URL: Joi.string().default('http://localhost:3000'),
	APP_DESC: Joi.string().default('NestJS 启动模板 API 文档'),
	APP_VERSION: Joi.string().default('1.0.0'),

	// JWT配置验证 - 生产环境必需
	JWT_SECRET: Joi.string().when('NODE_ENV', {
		is: 'production',
		then: Joi.required(),
		otherwise: Joi.string().default('dev-secret-key'),
	}),
	JWT_EXPIRES_IN: Joi.string().default('1d'),

	// 数据库配置验证
	DB_HOST: Joi.string().default('localhost'),
	DB_PORT: Joi.number().default(5432),
	DB_USERNAME: Joi.string().default('postgres'),
	DB_PASSWORD: Joi.string().default('postgres'),
	DB_DATABASE: Joi.string().default('nest_starter2'),

	// Redis配置验证
	REDIS_HOST: Joi.string().default('localhost'),
	REDIS_PORT: Joi.number().default(6379),
	REDIS_PASSWORD: Joi.string().allow('', null).default(''),
});
