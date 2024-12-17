import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ErrorExampleService } from './error-example.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('错误拦截用法示例')
@Controller('app/error-example')
export class ErrorExampleController {
	constructor(private readonly errorExampleService: ErrorExampleService) { }

	@Get('test-http-error')
	@ApiOperation({ summary: '测试 HTTP 异常' })
	testHttpError() {
		return this.errorExampleService.testHttpError();
	}

	@Get('test-program-error')
	@ApiOperation({ summary: '测试程序错误' })
	testProgramError() {
		return this.errorExampleService.testProgramError();
	}
}
