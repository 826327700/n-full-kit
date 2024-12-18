import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NO_CHECK_ROLES_KEY } from '../decorators/roles.decorator';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AdminUser, AdminUserDocument } from 'src/endpoints/admin/admin-users/entities/admin-user.entity';
import { PERMISSION_GROUP_KEY, PERMISSION_KEY } from '../decorators/permission.decorator';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		@InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
		private authService: AuthService,
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
		const authHeader = request.headers.authorization;
		if (!authHeader) {
			throw new UnauthorizedException('认证失败');
		}

		const [type, token] = authHeader.split(' ');
		if (type !== 'Bearer'||!token) {
			throw new UnauthorizedException('认证失败');
		}

		// 验证并解析token
		try {
			const user = await this.authService.verifyAsync(token, 'admin');
			if(!user){
				throw new UnauthorizedException('认证失败');
			}
			// 使用聚合查询获取用户的所有有效角色权限
			const userWithRoles = await this.adminUserModel.aggregate([
				{
					$match: {
						_id: new mongoose.Types.ObjectId(user.userId)
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
				return false; // 如果找不到有效角色或权限，拒绝访问
			}

			const userPermissions = userWithRoles[0].permissions;

			// 获取当前方法的权限key
			let permissionKey = Reflect.getMetadata(PERMISSION_KEY, context.getHandler());
			if (!permissionKey) {
				permissionKey = context.getHandler().name
			}
			const needPermission = `${permissionGroup}.${permissionKey}`;
			// 检查是否包含所需的角色权限
			return userPermissions.includes('root')||userPermissions.includes(needPermission);
		} catch (error) {
			return false;
		}

	}
}
