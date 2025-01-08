import { NestFactory } from '@nestjs/core'
import type { MicroserviceOptions } from '@nestjs/microservices'
import { app } from 'electron'
import { ElectronIpcTransport } from '@doubleshot/nest-electron'
import { AppModule } from './app.module'
import { initialApp } from './electron'
import { AllExceptionsFilter } from './filter/all-exceptions.filter'

async function bootstrap() {
	try {
		await initialApp();

		// 创建微服务应用
		const nestApp = await NestFactory.createMicroservice<MicroserviceOptions>(
			AppModule,
			{
				strategy: new ElectronIpcTransport(),
			},
		);
		nestApp.useGlobalFilters(new AllExceptionsFilter());

		nestApp.listen() // 启动微服务
	}
	catch (error) {
		app.quit()
	}
}

bootstrap()
