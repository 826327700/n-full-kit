import { SetMetadata } from '@nestjs/common';
import { CACHE_KEY_METADATA } from '@nestjs/cache-manager';

export type CacheKeyGenerator = (context: any) => string;

/**设置自定义缓存key */
export const CustomCacheKey = (keyGenerator: CacheKeyGenerator | string) => {
  if (typeof keyGenerator === 'string') {
    return SetMetadata(CACHE_KEY_METADATA, keyGenerator);
  }
  return SetMetadata('custom_cache_key_generator', keyGenerator);
};
