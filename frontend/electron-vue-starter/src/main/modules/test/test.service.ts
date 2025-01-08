import { Injectable } from '@nestjs/common';
import type { TestDto } from './test.dto';

@Injectable()
export class TestService {
	constructor(

	) { }

	async test(params:TestDto) {
		console.log("调用test",params)
		return `hello ${params.name} -- from main process`
	}

	async test2(params:TestDto):Promise<TestDto>{
		return params
	}
}
