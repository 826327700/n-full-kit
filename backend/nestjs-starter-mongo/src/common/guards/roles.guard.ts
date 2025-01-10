import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NO_CHECK_ROLES_KEY } from '../decorators/roles.decorator';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AdminUser, AdminUserDocument } from 'src/endpoints/admin/admin-users/entities/admin-user.entity';
import { PERMISSION_GROUP_KEY, PERMISSION_KEY } from '../decorators/permission.decorator';
import { getPermissionKey } from '../modules/permission-collect/permission-collect.service';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		@InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
		private reflector: Reflector
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const noCheckRoles = this.reflector.getAllAndOverride<string[]>(NO_CHECK_ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (noCheckRoles) {
			return true; // 如果使用了 @NoCheckRoles 装饰器，放行
		}


		// 获取当前控制器的权限组
		const permissionGroup = Reflect.getMetadata(PERMISSION_GROUP_KEY, context.getClass());
		if (!permissionGroup) {//没有设置权限组 放行
			return true
		}

		const request = context.switchToHttp().getRequest();

		// 使用聚合查询获取用户的所有有效角色权限
		const userWithRoles = await this.adminUserModel.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(request.user.userId)
				}
			},
			{
				$addFields: {
					roleIds: {
						$map: {
							input: '$roles',
							as: 'roleId',
							in: { $toObjectId: '$$roleId' }
						}
					}
				},
			},
			{
				$lookup: {
					from: 'admin_roles',
					localField: 'roleIds',
					foreignField: '_id',
					pipeline: [
						{
							$match: {
								status: '0'  // 只查询启用状态的角色
							}
						}
					],
					as: 'roles'
				}
			},
			{
				$project: {
					permissions: {
						$reduce: {
							input: '$roles',
							initialValue: [],
							in: { $concatArrays: ['$$value', '$$this.permissions'] }
						}
					}
				}
			}
		]).exec();

		if (!userWithRoles || userWithRoles.length === 0 || !userWithRoles[0].permissions.length) {
			throw new ForbiddenException('无权访问'); // 如果找不到有效角色或权限，拒绝访问
		}

		const userPermissions = userWithRoles[0].permissions;

		// 获取当前方法的权限key
		//@ts-ignore
		let needPermission = Reflect.getMetadata(PERMISSION_KEY, context.getHandler())||getPermissionKey(context.getRequest().url, context.getClass().name, context.getHandler().name)

		// 检查是否包含所需的角色权限
		if (userPermissions.includes('root') || userPermissions.includes(needPermission)) {
			return true
		} else {
			throw new ForbiddenException('无权访问');
		}

	}
}
