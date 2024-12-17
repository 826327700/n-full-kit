import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { RedisExampleService } from './redis-example.service';
import { ApiTags, ApiOperation, ApiParam, ApiHeader } from '@nestjs/swagger';
import { SetStringDto } from './dto/set-string.dto';
import { SetHashDto } from './dto/set-hash.dto';
import { SetValueDto } from './dto/set-value.dto';
import { CacheTTL } from '@nestjs/cache-manager';
import { CustomCacheKey } from 'src/common/decorators/custom-cache-key.decorator';

@ApiTags('Redis用法示例')
@Controller('redis-example')
export class RedisExampleController {
    constructor(private readonly redisExampleService: RedisExampleService) { }

    @CacheTTL(1000*60)//缓存60秒
    @Get('test-cache')
    @ApiOperation({ summary: '缓存http请求，首次请求3秒才返回数据，之后缓存60秒' })
    async testCache() {
        return this.redisExampleService.testCache();
    }

    @CacheTTL(1000*60)//缓存60秒
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
    @Get('test-cache-custom-key')
    @ApiOperation({ summary: '自定义缓存key来缓存http请求，首次请求3秒才返回数据，之后缓存60秒（本例：缓存key为用户ID）' })
    @ApiHeader({
        name: 'userId',
        description: '用户ID，用于生成缓存键，第一次访问后可换不同的userId来测试',
        required: true,
    })
    async testCacheCustomKey() {
        return this.redisExampleService.testCache();
    }

    @Post('remove-cache')
    @ApiOperation({ summary: '清除所有http缓存' })
    async removeCache() {
        return this.redisExampleService.removeCache();
    }

    @Post('remove-cache-key/:key')
    @ApiOperation({ summary: '清除指定http缓存' })
    @ApiParam({ name: 'key', description: '上面测试时填写的用户ID' })
    async removeCacheByKey(@Param('key') key: string) {
        return this.redisExampleService.removeCacheByKey(key);
    }

    @Post('string')
    @ApiOperation({ summary: '设置字符串值' })
    async setString(@Body() setStringDto: SetStringDto) {
        return this.redisExampleService.setString(
            setStringDto.key,
            setStringDto.value,
            setStringDto.ttl
        );
    }

    @Get('string/:key')
    @ApiOperation({ summary: '获取字符串值' })
    @ApiParam({ name: 'key', description: '键' })
    async getString(@Param('key') key: string) {
        return this.redisExampleService.getString(key);
    }

    @Post('hash')
    @ApiOperation({ summary: '设置哈希表字段' })
    async setHash(@Body() setHashDto: SetHashDto) {
        return this.redisExampleService.setHash(
            setHashDto.key,
            setHashDto.field,
            setHashDto.value
        );
    }

    @Get('hash/:key')
    @ApiOperation({ summary: '获取哈希表所有字段' })
    @ApiParam({ name: 'key', description: '键' })
    async getHash(@Param('key') key: string) {
        return this.redisExampleService.getHash(key);
    }

    @Post('list')
    @ApiOperation({ summary: '向列表添加元素' })
    async pushList(@Body() setValueDto: SetValueDto) {
        return this.redisExampleService.pushList(
            setValueDto.key,
            setValueDto.value
        );
    }

    @Get('list/:key')
    @ApiOperation({ summary: '获取列表所有元素' })
    @ApiParam({ name: 'key', description: '键' })
    async getList(@Param('key') key: string) {
        return this.redisExampleService.getList(key);
    }

    @Post('set')
    @ApiOperation({ summary: '向集合添加元素' })
    async addToSet(@Body() setValueDto: SetValueDto) {
        return this.redisExampleService.addToSet(
            setValueDto.key,
            setValueDto.value
        );
    }

    @Get('set/:key')
    @ApiOperation({ summary: '获取集合所有元素' })
    @ApiParam({ name: 'key', description: '键' })
    async getSet(@Param('key') key: string) {
        return this.redisExampleService.getSet(key);
    }

    @Delete(':key')
    @ApiOperation({ summary: '删除键' })
    @ApiParam({ name: 'key', description: '键' })
    async delete(@Param('key') key: string) {
        return this.redisExampleService.delete(key);
    }

    @Get('ttl/:key')
    @ApiOperation({ summary: '获取键的剩余生存时间' })
    @ApiParam({ name: 'key', description: '键' })
    async getTTL(@Param('key') key: string) {
        return this.redisExampleService.getTTL(key);
    }
}
