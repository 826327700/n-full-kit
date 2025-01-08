import { Controller } from '@nestjs/common';
import { TestService } from './test.service';
import { BindIpcHandle } from '../../decorators/bind-renderer-method';
import type { TestDto } from './test.dto';
import type { IpcContext } from '@doubleshot/nest-electron';
import { Ctx, Payload } from '@nestjs/microservices';

@Controller('test')
export class TestController {
	constructor(
		private readonly testService:TestService
	){}

	@BindIpcHandle({key:"test1",description:"测试接口1",paramsInterface: "TestDto",returnInterface: "any"})
	test(@Payload() params: TestDto,@Ctx() { ipcEvt }: IpcContext){
		return this.testService.test(params)
	}

	@BindIpcHandle({key:"test2",description:"测试接口2",paramsInterface: "TestDto",returnInterface: "any"})
	test2(@Payload() params: TestDto,@Ctx() { ipcEvt }: IpcContext){
		return this.testService.test2(params)
	}
}
