import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PERMISSION_DESC, PERMISSION_GROUP_DESC, PERMISSION_GROUP_KEY, PERMISSION_KEY } from 'src/common/decorators/permission.decorator';
import { AdminPermissionDocument, AdminPermissionSchema } from 'src/endpoints/admin/admin-roles/entities/admin-permission.entity';

@Injectable()
export class PermissionCollectService {
	constructor(
		private readonly discoveryService: DiscoveryService,
		@InjectModel(AdminPermissionSchema.name) private adminPermissionModel: Model<AdminPermissionDocument>,
	) {
		setTimeout(async () => {
			const permissions=this.collectPermissions();
			
			let docs=[]
			permissions.forEach(permission => {
				docs.push({
					key:permission.key.name,
					description:permission.key.description,
					group:permission.group.name,
					groupDescription:permission.group.description
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
		const permissions:{
			group:{
				name:string,
				description:string
			},
			key:{
				name:string,
				description:string
			}
		}[]=[]
		for (const wrapper of controllers) {
			const instance = wrapper.instance;

			// 忽略未初始化的 Controller
			if (!instance || typeof instance !== 'object') continue;
			const controllerPrototype = Object.getPrototypeOf(instance);
			const permissionGroup = Reflect.getMetadata(PERMISSION_GROUP_KEY, controllerPrototype.constructor);
			const permissionGroupDescription = Reflect.getMetadata(PERMISSION_GROUP_DESC, controllerPrototype.constructor)
			// 仅收集含有@PermissionGroup装饰器的 Controller
			if(permissionGroup){
				// 遍历 Controller 中的方法
				for (const methodName of Object.getOwnPropertyNames(controllerPrototype)) {
					const method = controllerPrototype[methodName];

					if (typeof method !== 'function'||methodName==="constructor") continue;
					let permissionKey=Reflect.getMetadata(PERMISSION_KEY, method);
					if(!permissionKey){
						permissionKey=methodName
					}
					let permissionDescription=Reflect.getMetadata(PERMISSION_DESC, method)
					if(!permissionDescription){
						// 获取 Swagger 的 @ApiOperation 元数据
						const apiOperation = Reflect.getMetadata("swagger/apiOperation", method);
						permissionDescription=apiOperation?.summary
					}
					permissions.push({
						group:{
							name:permissionGroup,
							description:permissionGroupDescription
						},
						key:{
							name:`${permissionGroup}.${permissionKey}`,
							description:permissionDescription
						}
					})
				}
			}
		}
		return permissions
	}

	/**将权限信息收集到数据库 */
	// async savePermissionsToDatabase() {
	// 	// 保存权限信息到数据库
	// }
}
