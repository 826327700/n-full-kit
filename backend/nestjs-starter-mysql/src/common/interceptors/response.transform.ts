// 基础响应接口
export interface BaseResponse<T> {
	[key: string]: any;
}

// 转换选项接口
export interface TransformOptions {
	code?: number;
	message?: string;
}

// 转换器接口
export interface ResponseTransformer<T> {
	transform(data: T, options?: TransformOptions): BaseResponse<T>;
}

// App响应转换器
export class AppResponseTransformer<T> implements ResponseTransformer<T> {
	transform(data: T, options?: TransformOptions): BaseResponse<T> {
		return {
			data,
			code: options?.code ?? 0,
			message: options?.message ?? '请求成功'
		};
	}
}

// Admin响应转换器
export class AdminResponseTransformer<T> implements ResponseTransformer<T> {
	transform(data: T, options?: TransformOptions): BaseResponse<T> {
		return {
			data,
			code: options?.code ?? 0,
			message: options?.message ?? '请求成功'
		};
	}
}

// 响应转换器工厂
export class ResponseTransformerFactory {
	private static transformers = new Map<string, ResponseTransformer<any>>([
		['app', new AppResponseTransformer()],
		['admin', new AdminResponseTransformer()]
	]);

	static getTransformer(path: string): ResponseTransformer<any> | null {
		// 从路径中提取模块名
		const moduleName = path.split('/')[1]; // 获取路径中的第一个部分
		return this.transformers.get(moduleName) || null;
	}

	static registerTransformer(prefix: string, transformer: ResponseTransformer<any>) {
		this.transformers.set(prefix, transformer);
	}
}
