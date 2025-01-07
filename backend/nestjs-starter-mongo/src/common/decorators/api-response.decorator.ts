import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

/**自定义响应结构 */
export const CustomApiResponse = <TModel extends Type<any> | 'string' | 'number' | 'boolean' | 'integer'>({
	type,
	example,
	description,
	isList = false,
	isPage = false
}: {
	/**响应类型 */
	type: TModel;
	/**响应示例 */
	example?: any;
	/**响应描述 */
	description?: string;
	/**是否为列表 */
	isList?: boolean;
	/**是否为分页 */
	isPage?: boolean;
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

	// 创建非分页响应结构
	const createResponseSchema = () => {
		return isBasicType
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
				}
	}
	// 创建分页响应结构
	const createPageResponseSchema = () => {
		return {
			type: 'object',
			properties: {
				list: {
					type: 'array',
					items: { $ref: getSchemaPath(type as Type<any>) },
					description: '数据列表'
				},
				total: {
					type: 'number',
					example: 0,
					description: '总数'
				},
				page: {
					type: 'number',
					example: 1,
					description: '当前页码'
				},
				pageSize: {
					type: 'number',
					example: 10,
					description: '每页数量'
				}
			},
			required: ["list", "total", "page", "pageSize"]
		}
	}
	const dataSchema = isPage ? createPageResponseSchema() : createResponseSchema();

	return applyDecorators(
		...(isBasicType ? [] : [ApiExtraModels(type as Type<any>)]),
		ApiOkResponse({
			description,
			schema: {
				allOf: [
					{
						properties: {
							data: dataSchema,
							code: {
								type: 'number',
								example: 0
							},
							message: {
								type: 'string',
								example: '请求成功'
							}
						},
						required: ["data", "code", "message"]
					}
				]
			}
		})
	);
};
