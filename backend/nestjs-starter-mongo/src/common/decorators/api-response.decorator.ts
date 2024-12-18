import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageResponse } from '../interfaces/page-response.interface';

export interface BaseApiResponse<T> {
	data: T;
	code: number;
	message: string;
}

/**自定义响应结构 列表 */
// export const CustomApiResponseList = <TModel extends Type<any>>(model: TModel) => {
// 	return applyDecorators(
// 		ApiExtraModels(model),
// 		ApiOkResponse({
// 			schema: {
// 				allOf: [
// 					{
// 						properties: {
// 							data: {
// 								type: 'array',
// 								items: { $ref: getSchemaPath(model) }
// 							},
// 							code: {
// 								type: 'number',
// 								example: 0
// 							},
// 							message: {
// 								type: 'string',
// 								example: '请求成功'
// 							}
// 						}
// 					}
// 				]
// 			}
// 		})
// 	);
// };

/**自定义响应结构 */
export const CustomApiResponse = <TModel extends Type<any> | 'string' | 'number' | 'boolean' | 'integer'>({
    type,
    example,
    description,
    isList = false,
}: {
    type: TModel;
    example?: any;
    description?: string;
    isList?: boolean;
}) => {
    // 判断传入的 type 是否为构造函数，如 String, Number, Boolean
    const isBasicType = [String, Number, Boolean].includes(type as any);

    // 映射构造函数到基础类型字符串
    const basicTypeMapping: Record<string, string> = {
        'String': 'string',
        'Number': 'number',
        'Boolean': 'boolean',
        'integer': 'number'  // 特别处理 'integer' 为 'number'
    };

    // 获取类型的基础类型名称
    const getTypeName = (type: any): string => {
        if (type === String || type === Number || type === Boolean) {
            return type.name;  // 返回 "String"、"Number" 或 "Boolean"
        }
        return type as string;  // 其他类型直接返回字符串类型
    };

    const getBasicTypeSchema = (type: string) => ({
        type: type === 'integer' ? 'number' : type
    });

    return applyDecorators(
        ...(isBasicType ? [] : [ApiExtraModels(type as Type<any>)]),
        ApiOkResponse({
            description,
            schema: {
                allOf: [
                    {
                        properties: {
                            data: isBasicType
                                ? isList
                                    ? {
                                        type: 'array',
                                        items: getBasicTypeSchema(basicTypeMapping[getTypeName(type as any)] || type as string)
                                    }
                                    : {
                                        type: basicTypeMapping[getTypeName(type as any)] || type as string,
                                        example
                                    }
                                : isList
                                    ? {
                                        type: 'array',
                                        items: { $ref: getSchemaPath(type as Type<any>) }
                                    }
                                    : {
                                        $ref: getSchemaPath(type as Type<any>)
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
// export const CustomApiResponsePage = <TModel extends Type<any>>(model: TModel,description?:string) => {
// 	return applyDecorators(
// 		ApiExtraModels(model),
// 		ApiOkResponse({
// 			description,
// 			schema: {
// 				allOf: [
// 					{
// 						properties: {
// 							data: {
// 								properties: {
// 									list: {
// 										type: 'array',
// 										items: { $ref: getSchemaPath(model) }
// 									},
// 									total: {
// 										type: 'number',
// 										example: 100
// 									},
// 									page: {
// 										type: 'number',
// 										example: 1
// 									},
// 									pageSize: {
// 										type: 'number',
// 										example: 10
// 									}
// 								}
// 							},
// 							code: {
// 								type: 'number',
// 								example: 0
// 							},
// 							message: {
// 								type: 'string',
// 								example: '请求成功'
// 							}
// 						}
// 					}
// 				]
// 			}
// 		})
// 	);
// };

export const ApiResponse = <TModel extends Type<any> | 'string' | 'number' | 'boolean' | 'integer'>(
    options: {
        schema: {
            type: string;
            items?: any;
            example?: any;
        };
        description?: string;
    }
) => {
    const { schema, description } = options;

    return applyDecorators(
        ApiOkResponse({
            description,
            schema: {
                allOf: [
                    {
                        properties: {
                            data: schema,
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
