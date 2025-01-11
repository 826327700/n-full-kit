---
outline: deep
---

# 缓存和限流

## 概述

在NestJS项目中，缓存和限流是两个非常重要的功能。缓存可以提高系统的响应速度，减少数据库的压力；限流可以防止系统被恶意请求攻击，保证系统的稳定性。

## 缓存
### 配置
缓存功能依赖于`Redis`，请确认在上一章中已在环境变量中配置好`Redis`的连接信息，缓存模块将在`src/root.module.ts`中初始化`Redis`连接。
```ts
@Module({
	imports: [
        //...
        /**缓存模块 */
        CacheModule.registerAsync({
            isGlobal: true,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const store = await redisStore({
                    password: configService.get('REDIS_PASSWORD', ''),
                    socket: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        passphrase: configService.get('REDIS_PASSWORD', ''),
                    },
                });

                return {
                    store: store as unknown as CacheStore,
                    ttl: 3 * 60000, // 3 minutes (milliseconds)
                };
            },
        })
        //...
    ]
})

```
### 使用
在需要使用缓存的接口方法上，使用`@CacheTTL()`装饰器标记该接口进行缓存。
- `@CacheTTL(毫秒)` 参数为毫秒，例如`@CacheTTL(1000*60)`则表示该接口缓存60秒，60秒内的请求都将从`Redis`获取并返回缓存数据。
```ts{1}
@CacheTTL(1000*60)//缓存60秒 // [!code focus]
@Get('test-cache')
@ApiOperation({ summary: '缓存http请求，首次请求3秒才返回数据，之后缓存60秒' })
async testCache() {
    return this.redisExampleService.testCache();
}
```
有时候，我们需要手动移除缓存，则需使用`@nestjs/cache-manager`提供的`CacheManager`操作缓存：
```ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class CacheExampleService {
	constructor(
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

    /**清除所有缓存 */
    async removeCache() {
		await this.cacheManager.reset();
		return "缓存清除成功";
	}

    /**清除指定key的缓存 */
	async removeCacheByKey(key: string) {
		let cache=`xxxxxx` //默认情况下 key是缓存接口的路径
		await this.cacheManager.del(cache);
		return `${cache}缓存清除成功`;
	}
}
```
有时候我们需要给同一个接口动态的设置缓存key，以达到不同的效果。情景案例：A，B两个用户访问他们各自的文章列表，假设路径是`/post/list`，如果没有自定义key，默认的缓存会将第一个用户访问`/post/list`接口后的信息缓存，第二个用户访问时，将第一个用户的信息当做缓存返回。我们需要给不同的用户设置不同的缓存key。   
本项目封装了`@CustomCacheKey`装饰器，用于动态自定义缓存key：
```ts
@CustomCacheKey((context) => {
    const request = context.switchToHttp().getRequest();
    // 获取查询参数
    // const query = request.query;  // ?key=value 形式的参数
    
    // 获取路由参数
    // const params = request.params;  // /:id 形式的参数
    
    // 获取请求体
    // const body = request.body;  // POST 请求的 body
    
    // 获取请求头
    const headers = request.headers;
    
    // 获取请求方法
    // const method = request.method;
    
    // 获取请求路径
    const path = request.path;
    return `${headers.userid}:${path}`;
})
```
- `@CustomCacheKey`的参数是一个方法，方法中持有`context`请求上下文，可以根据这个`context`获取想要的信息，并最终拼接出一个自定义的key。
- 上面的代码示例中，我们假设`headers`中存在一个`userid`字段表明当前用户的id，最终拼接`${headers.userid}:${path}`得到每一个用户不同的key。
> [!TIP] 提示
> - `@CustomCacheKey`源码位于`src/common/decorators/custom-cache-key.decorator.ts`
> - 缓存示例源码位于`src/endpoints/app/redis-example`



## 限流

### 配置

在本项目中使用`@nestjs/throttler`模块来实现限流功能。

在`src/endpoints/endpoints.module.ts`中配置限流模块：
```ts{9-12,16-22}
import { Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { AdminModule } from './admin/admin.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		ThrottlerModule.forRoot([{ // [!code focus:4]
			ttl: 60000, // 1分钟
			limit: 10,  // 最多10个请求
		}]),
		AppModule,
		AdminModule,
	],
	providers: [ // [!code focus:7]
		// 如果想开启全局限流 请取消此注释
		// {
		// 	provide: APP_GUARD,
		// 	useClass: ThrottlerGuard,
		// },
	],
})
export class EndpointsModule { }

```

### 使用

在控制器中使用限流：

```ts{4,12,18-19,26}
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('限流用法示例')
@Controller('rate-limit')
export class RateLimitController {
	constructor(private readonly rateLimitService: RateLimitService) { }
	@ApiOperation({ summary: '全局默认限流配置，请连续请求10次测试' })
	@Get('default')
	@UseGuards(ThrottlerGuard) // 如果使用全局限流 此处装饰器可省略
	getDefaultLimit() {
		return this.rateLimitService.getDefaultLimit();
	}

	@ApiOperation({ summary: '自定义限流配置，1分钟最多3次请求，请连续请求3次测试' })
	@Throttle({ default: { limit: 3, ttl: 60000 } })// 用于覆盖ThrottlerModule.forRoot的限流设置
	@UseGuards(ThrottlerGuard) // 如果使用全局限流 此处装饰器可省略
	@Get('strict')
	getStrictLimit() {
		return this.rateLimitService.getStrictLimit();
	}

	@ApiOperation({ summary: '不启用限流' })
	@SkipThrottle() // 如果使用全局限流 此处装饰器可用于跳过限流
	@Get('no-limit')
	getNoLimit() {
		return this.rateLimitService.getNoLimit();
	}
}

```

> [!TIP] 提示
> - 限流示例源码位于`src/endpoints/app/rate-limit`

