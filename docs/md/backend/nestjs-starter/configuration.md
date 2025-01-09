---
outline: deep
---

# 基础配置

## 概述
在创建完成后端项目之后，首次启动项目，需要先配置一些基础信息。在项目的根目录`.env`和`.env.development`、`.env.production`填写如数据库连接信息等。

## 配置
::: code-group
```env [.env]
# 应用配置
NODE_ENV=developmen  
PORT=3000
APP_NAME=NestJS API
APP_URL=http://localhost:3000
APP_DESC=我的 NestJS API 文档
APP_VERSION=1.0.1
```
```env [.env.development]
# JWT配置
JWT_SECRET=development-secret-key
JWT_EXPIRES_IN=7d

JWT_ADMIN_SECRET=development-admin-secret-key
JWT_ADMIN_EXPIRES_IN=7d

# MongoDB配置 (如果是MongoDB模板)
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USERNAME=admin
MONGODB_PASSWORD=admin123
MONGODB_DATABASE=testdb

# MySQL数据库配置 (如果是MySQL模板)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=admin
MYSQL_PASSWORD=admin123
MYSQL_DATABASE=testdb

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Loki日志配置
LOKI_ENABLED=false
LOKI_HOST=localhost
LOKI_PORT=3100
```
```env [.env.production]
# JWT配置
JWT_SECRET=production-secret-key
JWT_EXPIRES_IN=7d

JWT_ADMIN_SECRET=production-admin-secret-key
JWT_ADMIN_EXPIRES_IN=7d

# MongoDB配置 (如果是MongoDB模板)
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USERNAME=admin
MONGODB_PASSWORD=admin123
MONGODB_DATABASE=testdb

# MySQL数据库配置 (如果是MySQL模板)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=admin
MYSQL_PASSWORD=admin123
MYSQL_DATABASE=testdb

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Loki日志配置
LOKI_ENABLED=true
LOKI_HOST=localhost
LOKI_PORT=3100
```
:::
::: tip 提示
- `.env` 是公共配置
- `.env.development`或`.env.production` 是业务相关的配置
- `数据库部分`、`Redis`是必须填写正确才能正常运行项目。其他项可以酌情自行修改
:::

## 自定义配置说明
本项目模板在`src/config`目录下，通过`ConfigModule`模块来载入环境变量配置。
::: code-group
```ts [src/config/config.module.ts]
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { appConfig, jwtConfig, mongodbConfig, redisConfig, lokiConfig } from './configuration';

@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: true, // 使配置模块在全局可用
			load: [appConfig, jwtConfig, mongodbConfig, redisConfig,lokiConfig],
			envFilePath: [
				`.env.${process.env.NODE_ENV || 'development'}`,
				'.env',
			],
			validationOptions: {
				allowUnknown: true, // 允许未知的环境变量
				abortEarly: false, // 显示所有验证错误
			},
			expandVariables: true, // 允许环境变量中使用其他环境变量
		}),
	],
})
export class ConfigModule {}

```
```ts [src/config/configuration.ts]
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

// mongodb数据库配置
export const mongodbConfig = registerAs('mongodb', () => ({
	host: process.env.MONGODB_HOST || 'localhost',
	port: parseInt(process.env.MONGODB_PORT, 10) || 5432,
	username: process.env.MONGODB_USERNAME || 'mongo',
	password: process.env.MONGODB_PASSWORD || 'mongo',
	database: process.env.MONGODB_DATABASE || 'nest_starter',
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
	host: process.env.LOKI_HOST || 'localhost',
	port: parseInt(process.env.LOKI_PORT, 10) || 3100,
}));

// 配置结构定义
export default () => ({
	app: appConfig(),
	jwt: jwtConfig(),
	mongodb: mongodbConfig(),
	redis: redisConfig(),
	loki: lokiConfig(),
});

```
:::
可以根据自身需要修改配置项。

使用示例：
```ts
//在注入了ConfigService之后
const dbConfig = configService.get('mongodb');
```