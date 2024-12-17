import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { BaseExceptionFilter } from './base.filter';
import { WinstonLoggerService } from '../logger/winston.service';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
	private readonly nestLogger = new Logger('HttpExceptionFilter');

  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
  ) {
    super();
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const startTime = (request as any).startTime || Date.now(); // 从请求对象中获取开始时间
    const duration = Date.now() - startTime;

    const exceptionResponse = exception.getResponse();
    const status = exception.getStatus();
    let customCode = 0;
    let message = '请求错误';

    if(typeof exceptionResponse === 'object') {
      customCode = (exceptionResponse as any).code||(exceptionResponse as any).statusCode||status;
      message = (exceptionResponse as any).message;
    }
    if(typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    // 记录错误日志
    this.logger.error(
      `[Request Error] ${request.method} ${request.url} - ${duration}ms`,
      exception.stack,
      {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        body: request.body,
        query: request.query,
        params: request.params,
        error: {
          status,
          code: customCode,
          message,
        },
        duration,
      }
    );

	// 使用 nest原始logger将错误堆栈打印到控制台
	Logger.error(`[IP] ${request.ip} [Request] ${request.method} ${request.url} - ${duration}ms`);
	Logger.error(exception.stack, exception.name);
    response
      .status(status)
			.json(this.formatErrorResponse(request.url, null, customCode,message));
  }
}
