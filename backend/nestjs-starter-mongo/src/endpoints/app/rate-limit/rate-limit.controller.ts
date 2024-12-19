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
	@UseGuards(ThrottlerGuard)
	getDefaultLimit() {
		return this.rateLimitService.getDefaultLimit();
	}

	@ApiOperation({ summary: '自定义限流配置，1分钟最多3次请求，请连续请求3次测试' })
	@Throttle({ default: { limit: 3, ttl: 60000 } })
	@UseGuards(ThrottlerGuard)
	@Get('strict')
	getStrictLimit() {
		return this.rateLimitService.getStrictLimit();
	}

	@ApiOperation({ summary: '不启用限流' })
	@SkipThrottle()
	@Get('no-limit')
	getNoLimit() {
		return this.rateLimitService.getNoLimit();
	}
}
