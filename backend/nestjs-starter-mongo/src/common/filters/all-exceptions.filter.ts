import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from './base.filter';
import { HttpExceptionFilter } from './http-exception.filter';
import { WinstonLoggerService } from '../logger/winston.service';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
    @Inject(HttpExceptionFilter)
    private readonly httpExceptionFilter: HttpExceptionFilter,
  ) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    // 如果是 HttpException，委托给 HttpExceptionFilter 处理
    if (exception instanceof HttpException) {
      return this.httpExceptionFilter.catch(exception, host);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const startTime = (request as any).startTime || Date.now();
    const duration = Date.now() - startTime;

    // 获取详细的错误信息
    const error = exception as Error;

    // 使用 Winston 记录系统错误
    this.logger.error(
      `[System Error] ${request.method} ${request.url} - ${duration}ms`,
      error.stack,
      {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        body: request.body,
        query: request.query,
        params: request.params,
        error: {
          name: error.name,
          message: error.message
        },
        duration,
      }
    );
	Logger.error(`[IP] ${request.ip} [Request] ${request.method} ${request.url} - ${duration}ms`);
	// 使用 nest原始logger将错误堆栈打印到控制台
	Logger.error(error.stack, error.name);

    // 返回错误响应
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(this.formatErrorResponse(
        request.url,
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        '服务器内部错误',
      ));
  }
}
