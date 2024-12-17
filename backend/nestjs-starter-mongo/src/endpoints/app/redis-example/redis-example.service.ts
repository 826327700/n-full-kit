import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisExampleService {
	
	redis: Redis;

	constructor(
		private readonly redisService: RedisService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {
		this.redis = this.redisService.getOrThrow();
	}

	async testCache() {
		await new Promise((resolve) => setTimeout(resolve, 3000));
		return "首次请求3秒才返回的数据";
	}

	async removeCache() {
		await this.cacheManager.reset();
		return "缓存清除成功";
	}

	async removeCacheByKey(key: string) {
		let cache=`${key}:/redis-example/test-cache-custom-key`
		await this.cacheManager.del(cache);
		return `${cache}缓存清除成功`;
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
