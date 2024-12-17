import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonLoggerService } from '../logger/winston.service';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
	constructor(
		@Inject(WinstonLoggerService)
		private readonly logger: WinstonLoggerService,
	) { }

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const { method, url, body, query, params, ip, headers } = request;
		const userAgent = headers['user-agent'] || '';
		const startTime = Date.now();

		// 将开始时间保存到请求对象中，供异常过滤器使用
		request.startTime = startTime;

		return next.handle().pipe(
			tap(() => {
				const endTime = Date.now();
				const duration = endTime - startTime;
				this.logger.log(
					`[Request] ${method} ${url} - ${duration}ms`,
					{
						ip,
						userAgent,
						body,
						query,
						params,
						duration,
					}
				);
				// 使用 nest原始logger将请求信息打印到控制台
				Logger.log(`[IP] ${ip} [Request] ${method} ${url} - ${duration}ms`);
			}),
		);
	}
}
