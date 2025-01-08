import { Controller } from '@nestjs/common';
import { TestService } from './test.service';
import { BindIpcHandle, BindIpcOn } from '../../decorators/bind-renderer-method';
import type { TestDto } from './test.dto';
import type { IpcContext } from '@doubleshot/nest-electron';
import { Ctx, Payload } from '@nestjs/microservices';

/**测试控制器 */
@Controller('/test')
export class TestController {
	constructor(
		private readonly testService:TestService
	){}

	@BindIpcHandle({key:"test1",description:"测试接口1"})
	test(@Payload() params: TestDto,@Ctx() { ipcEvt }: IpcContext){
		return this.testService.test(params)
	}

	@BindIpcOn({key:"test2",description:"测试接口2"})
	test2(@Payload() params: TestDto,@Ctx() { ipcEvt }: IpcContext){
		return this.testService.test2(params)
	}
}
