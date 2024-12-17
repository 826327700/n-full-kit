import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ResponseTransformerFactory, TransformOptions } from '../interceptors/response.transform';

export abstract class BaseExceptionFilter implements ExceptionFilter {
	abstract catch(exception: any, host: ArgumentsHost): void;

	protected formatErrorResponse(url: string, data: any, status: number,message?:string) {
		const transformer = ResponseTransformerFactory.getTransformer(url);
		if (transformer) {
			const options: TransformOptions = {
				code: status,
				message: message ?? '请求失败',
			};
			return transformer.transform(data, options);
		}
		return data;
	}
}
