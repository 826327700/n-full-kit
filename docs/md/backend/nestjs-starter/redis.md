---
outline: deep
---

# Redis应用

## 概述

`Redis`是一个流行的开源内存数据结构存储，用作数据库、缓存和消息代理。它支持多种数据结构，如字符串、哈希、列表、集合、有序集合等。   
本项目封装了一个开箱即用的`Redis模块`，以帮助开发者快速的集成`Redis`到项目中。

## 使用

`Redis模块`位于`src/common/modules/redis`，已在`src/root.module.ts`中默认注入，只需要在`.env.development`或者`.env.production`环境变量中填写`Redis`的连接信息即可。
::: code-group
```.env{15-18} [.env.development]
# JWT配置
JWT_SECRET=development-secret-key
JWT_EXPIRES_IN=7d

JWT_ADMIN_SECRET=development-admin-secret-key
JWT_ADMIN_EXPIRES_IN=7d

# MongoDB配置
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USERNAME=admin
MONGODB_PASSWORD=admin123
MONGODB_DATABASE=testdb

# Redis配置  // [!code focus:4]
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Loki日志配置
LOKI_ENABLED=false
LOKI_HOST=localhost
LOKI_PORT=3100
```
```.env{15-18} [.env.production]
# JWT配置
JWT_SECRET=production-secret-key
JWT_EXPIRES_IN=7d

JWT_ADMIN_SECRET=production-admin-secret-key
JWT_ADMIN_EXPIRES_IN=7d

# MongoDB配置
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USERNAME=admin
MONGODB_PASSWORD=admin123
MONGODB_DATABASE=testdb

# Redis配置  // [!code focus:4]
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Loki日志配置
LOKI_ENABLED=false
LOKI_HOST=localhost
LOKI_PORT=3100
```
:::
`Redis模块`使用了第三方封装的redis库`@liaoliaots/nestjs-redis`，通过该库提供的`RedisService`服务的`.getOrThrow()`方法获取一个`redis实例`即可，示例代码：
```ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisExampleService {
	
	redis: Redis;

	constructor(
		private readonly redisService: RedisService,
	) {
		this.redis = this.redisService.getOrThrow();
	}

	/**
	 * 设置字符串值
	 * @param key 键
	 * @param value 值
	 * @param ttl 过期时间（秒）
	 */
	async setString(key: string, value: string, ttl?: number) {
		try {
			if (ttl) {
				await this.redis.set(key, value, 'EX', ttl);
			} else {
				await this.redis.set(key, value);
			}
		} catch (error) {
			console.error(error);
		}
		return { message: 'String value set successfully' };
	}

	/**
	 * 获取字符串值
	 * @param key 键
	 */
	async getString(key: string) {
		const value = await this.redis.get(key);
		return value;
	}

	/**
	 * 设置哈希表字段
	 * @param key 键
	 * @param field 字段
	 * @param value 值
	 */
	async setHash(key: string, field: string, value: string) {
		await this.redis.hset(key, field, value);
		return { message: 'Hash field set successfully' };
	}

	/**
	 * 获取哈希表所有字段
	 * @param key 键
	 */
	async getHash(key: string) {
		const value = await this.redis.hgetall(key);
		return { value };
	}

	/**
	 * 向列表添加元素
	 * @param key 键
	 * @param value 值
	 */
	async pushList(key: string, value: string) {
		await this.redis.rpush(key, value);
		return { message: 'List element pushed successfully' };
	}

	/**
	 * 获取列表所有元素
	 * @param key 键
	 */
	async getList(key: string) {
		const value = await this.redis.lrange(key, 0, -1);
		return { value };
	}

	/**
	 * 向集合添加元素
	 * @param key 键
	 * @param value 值
	 */
	async addToSet(key: string, value: string) {
		await this.redis.sadd(key, value);
		return { message: 'Set member added successfully' };
	}

	/**
	 * 获取集合所有元素
	 * @param key 键
	 */
	async getSet(key: string) {
		const value = await this.redis.smembers(key);
		return { value };
	}

	/**
	 * 删除键
	 * @param key 键
	 */
	async delete(key: string) {
		await this.redis.del(key);
		return { message: 'Key deleted successfully' };
	}

	/**
	 * 获取键的剩余生存时间
	 * @param key 键
	 */
	async getTTL(key: string) {
		const ttl = await this.redis.ttl(key);
		return { ttl };
	}
}

```
> [!TIP] 提示
> - 使用示例源码位于`src/endpoints/app/redis-example`
> - 还没有redis？[使用docker快速启动一个redis](#)