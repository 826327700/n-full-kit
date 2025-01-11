import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WinstonLoggerService } from 'src/common/logger/winston.service';

@Injectable()
export class ErrorExampleService {
	constructor(
		private readonly logger: WinstonLoggerService,
	) {}
	testHttpError(){
		// 测试 HTTP 异常
		throw new HttpException({
			code: 1,// 自定义错误码
			message: "用户权限不足"// 自定义错误信息
		}, HttpStatus.FORBIDDEN);
	}

	testProgramError(){
		// 测试程序错误
		const users = null;
		return users.find(u => u.id === 1); // 这里会抛出 TypeError，因为 users 是 null
	}
}
