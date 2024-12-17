import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageResponse } from '../interfaces/page-response.interface';

export interface BaseApiResponse<T> {
	data: T;
	code: number;
	message: string;
}

/**自定义响应结构 列表 */
export const CustomApiResponseList = <TModel extends Type<any>>(model: TModel) => {
	return applyDecorators(
		ApiExtraModels(model),
		ApiOkResponse({
			schema: {
				allOf: [
					{
						properties: {
							data: {
								type: 'array',
								items: { $ref: getSchemaPath(model) }
							},
							code: {
								type: 'number',
								example: 0
							},
							message: {
								type: 'string',
								example: '请求成功'
							}
						}
					}
				]
			}
		})
	);
};

/**自定义响应结构 */
export const CustomApiResponse = <TModel extends Type<any>>(model: TModel) => {
	return applyDecorators(
		ApiExtraModels(model),
		ApiOkResponse({
			schema: {
				allOf: [
					{
						properties: {
							data: {
								$ref: getSchemaPath(model)
							},
							code: {
								type: 'number',
								example: 0
							},
							message: {
								type: 'string',
								example: '请求成功'
							}
						}
					}
				]
			}
		})
	);
};

export const CustomApiResponsePage = <TModel extends Type<any>>(model: TModel) => {
	return applyDecorators(
		ApiExtraModels(model),
		ApiOkResponse({
			schema: {
				allOf: [
					{
						properties: {
							data: {
								properties: {
									list: {
										type: 'array',
										items: { $ref: getSchemaPath(model) }
									},
									total: {
										type: 'number',
										example: 100
									},
									page: {
										type: 'number',
										example: 1
									},
									pageSize: {
										type: 'number',
										example: 10
									}
								}
							},
							code: {
								type: 'number',
								example: 0
							},
							message: {
								type: 'string',
								example: '请求成功'
							}
						}
					}
				]
			}
		})
	);
};
