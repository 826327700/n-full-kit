---
outline: deep
---

# 统一响应结构
## 概述
`统一响应结构`是指所有后端接口都应当返回一个固定的数据结构，用于提升接口的可读性和可维护性，也方便接口调用方调用，几乎是所有后端接口必须实现的基础能力。   
本项目模板基于`Nestjs`的`interceptor`拦截器实现`统一响应结构`功能。

## 实现
在`src/common/interceptors/response.interceptor.ts`中声明了响应拦截器，并在`src/common/interceptors/response.transform.ts`中自定义了具体的响应转换逻辑。
::: code-group
```ts [response.interceptor.ts]
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

```
```ts [response.transform.ts]
import { ENDPOINTS } from "../constants/endpoints";

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
		[ENDPOINTS.APP, new AppResponseTransformer()],
		[ENDPOINTS.ADMIN, new AdminResponseTransformer()]
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


```
:::
上述的拦截器，将所有`接口方法`返回的信息包裹在统一的json结构中：
```json
{
    "data":"这里是接口方法返回的任意内容",
    "code":0,
    "message":"请求成功"
}
```
- `data` 是接口方法返回的任意结构的任意内容
- `code` 状态码，默认0表示请求成功，可在错误响应时在接口级别覆盖
- `message` 响应信息，默认为请求成功，可在错误响应时在接口级别覆盖

**额外说明：** `response.transform.ts`定义了两种转换器，分别对应`admin`端点和`app`端点，用于支持不同端点定义不同的响应结构。本示例中`admin`端点和`app`端点均返回相同的结构，有特殊需求的可自行修改。

## 用法
1. 正常请求：   
   只需要接口方法正常return需要响应的内容即可，内容可以是json对象任意类型，它将被赋值给`data`字段。
2. 错误请求：
   在代码逻辑中主动响应错误，代码如下
   ::: code-group
   ```ts [ts代码]
   throw new HttpException({
        code: 1,// 自定义业务层错误码
        message: "用户权限不足"// 自定义错误信息
    }, HttpStatus.FORBIDDEN); // HttpStatus.FORBIDDEN 是http请求层的状态码
   ```
   ```json [响应json]
   {
    "data": null,
    "code": 1,
    "message": "用户权限不足"
    }
   ```
   :::

::: tip 提示
- 错误示例可在`src/endpoints/app/error-example`中查看
:::