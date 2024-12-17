import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse, ResponseTransformerFactory } from './response.transform';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponse<T>> {
		const request = context.switchToHttp().getRequest();
		const url = request.url;

		return next.handle().pipe(
			map(data => {
				const transformer = ResponseTransformerFactory.getTransformer(url);
				if (transformer) {
					return transformer.transform(data);
				}
				return data;
			})
		);
	}
}
