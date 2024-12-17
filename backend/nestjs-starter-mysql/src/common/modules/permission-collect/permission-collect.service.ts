import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSION_DESC, PERMISSION_GROUP_DESC, PERMISSION_GROUP_KEY, PERMISSION_KEY } from 'src/common/decorators/permission.decorator';
import { AdminPermission } from 'src/endpoints/admin/admin-users/entities/admin-permission.entity';

@Injectable()
export class PermissionCollectService {
	constructor(
		private readonly discoveryService: DiscoveryService,
		@InjectRepository(AdminPermission)
		private adminPermissionRepository: Repository<AdminPermission>,
	) {
		setTimeout(async () => {
			const permissions = this.collectPermissions();

			const entities = permissions.map(permission =>
				this.adminPermissionRepository.create({
					key: permission.key.name,
					description: permission.key.description,
					group: permission.group.name,
					groupDescription: permission.group.description
				})
			);

			// 使用事务来确保原子性操作
			await this.adminPermissionRepository.manager.transaction(async manager => {
				// 先删除所有现有权限
				await manager.clear(AdminPermission);
				// 插入新的权限
				await manager.save(AdminPermission, entities);
			});
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
		}[] = [];

		for (const wrapper of controllers) {
			const instance = wrapper.instance;

			// 忽略未初始化的 Controller
			if (!instance || typeof instance !== 'object') continue;
			const controllerPrototype = Object.getPrototypeOf(instance);
			const permissionGroup = Reflect.getMetadata(PERMISSION_GROUP_KEY, controllerPrototype.constructor);
			const permissionGroupDescription = Reflect.getMetadata(PERMISSION_GROUP_DESC, controllerPrototype.constructor)

			// 仅收集含有@PermissionGroup装饰器的 Controller
			if (permissionGroup) {
				// 遍历 Controller 中的方法
				for (const methodName of Object.getOwnPropertyNames(controllerPrototype)) {
					const method = controllerPrototype[methodName];

					if (typeof method !== 'function' || methodName === "constructor") continue;
					let permissionKey = Reflect.getMetadata(PERMISSION_KEY, method);
					if (!permissionKey) {
						permissionKey = methodName;
					}
					let permissionDescription = Reflect.getMetadata(PERMISSION_DESC, method);
					if (!permissionDescription) {
						// 获取 Swagger 的 @ApiOperation 元数据
						const apiOperation = Reflect.getMetadata("swagger/apiOperation", method);
						permissionDescription = apiOperation?.summary;
					}
					permissions.push({
						group: {
							name: permissionGroup,
							description: permissionGroupDescription
						},
						key: {
							name: `${permissionGroup}.${permissionKey}`,
							description: permissionDescription
						}
					});
				}
			}
		}
		return permissions;
	}
}
