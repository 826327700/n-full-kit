import { registerAs } from '@nestjs/config';

// 应用配置
export const appConfig = registerAs('app', () => ({
	env: process.env.NODE_ENV || 'development',
	name: process.env.APP_NAME || 'NestJS API',
	url: process.env.APP_URL || 'http://localhost:3000',
	port: parseInt(process.env.PORT, 10) || 3000,
	description: process.env.APP_DESC || 'NestJS 启动模板 API 文档',
	version: process.env.APP_VERSION || '1.0.0',
}));

// JWT配置
export const jwtConfig = registerAs('jwt', () => ({
	app: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRES_IN || '1d',
	},
	admin: {
		secret: process.env.JWT_ADMIN_SECRET,
		expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '1d',
	},
}));

// mysql数据库配置
export const mysqlConfig = registerAs('mysql', () => ({
	host: process.env.MYSQL_HOST || 'localhost',
	port: parseInt(process.env.MYSQL_PORT, 10) || 5432,
	username: process.env.MYSQL_USERNAME || 'mysql',
	password: process.env.MYSQL_PASSWORD || 'mysql',
	database: process.env.MYSQL_DATABASE || 'nest_starter',
}));

// Redis配置
export const redisConfig = registerAs('redis', () => ({
	host: process.env.REDIS_HOST || 'localhost',
	port: parseInt(process.env.REDIS_PORT, 10) || 6379,
	password: process.env.REDIS_PASSWORD,
}));

// Loki配置
export const lokiConfig = registerAs('loki', () => ({
	enabled: process.env.LOKI_ENABLED === 'true',
	host: process.env.LOKI_HOST || 'localhost:3100',
	basicAuth: process.env.LOKI_BASIC_AUTH,
}));

// 配置结构定义
export default () => ({
	app: appConfig(),
	jwt: jwtConfig(),
	mysql: mysqlConfig(),
	redis: redisConfig(),
	loki: lokiConfig(),
});
