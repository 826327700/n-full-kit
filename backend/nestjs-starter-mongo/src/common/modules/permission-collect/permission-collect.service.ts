import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PERMISSION_DESC, PERMISSION_GROUP_DESC, PERMISSION_GROUP_KEY, PERMISSION_KEY } from 'src/common/decorators/permission.decorator';
import { NO_CHECK_ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { AdminPermissionDocument, AdminPermissionSchema } from 'src/endpoints/admin/admin-roles/entities/admin-permission.entity';

function extractFirstPath(url: string): string {
	const match = url.match(/^\/?([^\/]+)/);  // 匹配可能带有前导斜杠的路径，提取第一节路径
	return match ? match[1] : '';  // 如果有匹配项，返回第一节路径，否则返回空字符串
}
function toCamelCase(str) {
	return str
		.replace(/[-_](.)/g, (match, letter) => letter.toUpperCase())  // 将分隔符后面的字母转换为大写
		.replace(/^./, (match) => match.toLowerCase());  // 将第一个字母转为小写
}
function toPascalCase(str) {
	return str
		.replace(/[-_](.)/g, (match, letter) => letter.toUpperCase())  // 将分隔符后面的字母转换为大写
		.replace(/^./, (match) => match.toUpperCase());  // 将第一个字母转为大写
}
export function getPermissionKey(startPath:string,controllerName:string,methodName:string) {
	startPath = extractFirstPath(startPath)
	let permissionKey = toCamelCase(controllerName) + toPascalCase(methodName)
	if(startPath){
		permissionKey = startPath+'.' + permissionKey
	}
	return permissionKey
}

@Injectable()
export class PermissionCollectService {
	constructor(
		private readonly discoveryService: DiscoveryService,
		@InjectModel(AdminPermissionSchema.name) private adminPermissionModel: Model<AdminPermissionDocument>,
	) {
		/**将权限信息收集到数据库 */
		setTimeout(async () => {
			const permissions = this.collectPermissions();
			let docs = []
			permissions.forEach(permission => {
				docs.push({
					key: permission.key.name,
					description: permission.key.description,
					group: permission.group.name,
					groupDescription: permission.group.description
				})
			});
			await this.adminPermissionModel.deleteMany();
			await this.adminPermissionModel.insertMany(docs);
		}, 1000);
	}

	/**收集权限声明 */
	collectPermissions() {
		// 获取所有控制器实例
		const controllers = this.discoveryService.getControllers();
		const permissions: {
			group: {
				name: string,
				description: string
			},
			key: {
				name: string,
				description: string
			}
		}[] = []
		for (const wrapper of controllers) {
			const instance = wrapper.instance;

			// 忽略未初始化的 Controller
			if (!instance || typeof instance !== 'object') continue;
			const controllerPrototype = Object.getPrototypeOf(instance);
			const permissionGroup = Reflect.getMetadata(PERMISSION_GROUP_KEY, controllerPrototype.constructor);
			const permissionGroupDescription = Reflect.getMetadata(PERMISSION_GROUP_DESC, controllerPrototype.constructor)
			// 仅收集含有@PermissionGroup装饰器的 Controller
			if (permissionGroup) {
				
				// 获取 Controller 的 @Controller 元数据
				const controllerPath = Reflect.getMetadata("path", controllerPrototype.constructor);
				const startPath = extractFirstPath(controllerPath)
				const controllerName = controllerPrototype.constructor.name
				// 遍历 Controller 中的方法
				for (const methodName of Object.getOwnPropertyNames(controllerPrototype)) {
					const method = controllerPrototype[methodName];

					if (typeof method !== 'function' || methodName === "constructor") continue;

					let noCheckRoles = Reflect.getMetadata(NO_CHECK_ROLES_KEY, method)
					if (noCheckRoles) continue

					let permissionKey = getPermissionKey(controllerPath,controllerName,methodName)
					let permissionDescription = Reflect.getMetadata(PERMISSION_DESC, method)
					if (!permissionDescription) {
						// 获取 Swagger 的 @ApiOperation 元数据
						const apiOperation = Reflect.getMetadata("swagger/apiOperation", method);
						permissionDescription = apiOperation?.summary
					}
					permissions.push({
						group: {
							name: permissionGroup,
							description: permissionGroupDescription
						},
						key: {
							name: permissionKey,
							description: permissionDescription
						}
					})
				}
			}
		}
		return permissions
	}


}
