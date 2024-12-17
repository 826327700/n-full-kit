import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(RootModule);
	const configService = app.get(ConfigService);

	// 允许cors
	app.enableCors();

	// 全局使用管道
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	// 全局响应拦截器
	app.useGlobalInterceptors(new ResponseInterceptor());

	// Swagger 配置
	const config = new DocumentBuilder()
		.setTitle(configService.get('app.name', 'NestJS API'))
		.setDescription(configService.get('app.description', 'NestJS 启动模板 API 文档'))
		.setVersion(configService.get('app.version', '1.0.0'))
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header',
			},
			'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
		jsonDocumentUrl: 'swagger-json',
	});

	const port = configService.get('app.port', 3000);
	await app.listen(port);

	console.log(`Application is running on: ${await app.getUrl()}`);
	console.log(`Swagger is running on: ${await app.getUrl()}/swagger`);
	console.log(`Environment: ${configService.get('app.env')}`);
}
bootstrap();
