import { CacheInterceptor, CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheKeyGenerator } from '../decorators/custom-cache-key.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: any,
    @Inject(Reflector) reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    // 检查是否设置了 CacheTTL
    const ttl = this.reflector.get(CACHE_TTL_METADATA, context.getHandler());
    if (ttl === undefined) {
      return undefined; // 如果没有设置 CacheTTL，不进行缓存
    }

    const keyGenerator = this.reflector.get<CacheKeyGenerator>(
      'custom_cache_key_generator',
      context.getHandler(),
    );

    if (keyGenerator) {
      return keyGenerator(context);
    }

    return super.trackBy(context);
  }
}
