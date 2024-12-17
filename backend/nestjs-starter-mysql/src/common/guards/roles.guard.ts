import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NO_CHECK_ROLES_KEY } from '../decorators/roles.decorator';
import { AdminUser } from 'src/endpoints/admin/admin-users/entities/admin-user.entity';
import { AdminRole } from 'src/endpoints/admin/admin-users/entities/admin-role.entity';
import { PERMISSION_GROUP_KEY, PERMISSION_KEY } from '../decorators/permission.decorator';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		@InjectRepository(AdminUser)
		private adminUserRepository: Repository<AdminUser>,
		@InjectRepository(AdminRole)
		private adminRoleRepository: Repository<AdminRole>,
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
			return false;
		}

		const [type, token] = authHeader.split(' ');
		if (type !== 'Bearer') {
			return false;
		}

		// 验证并解析token
		try {
			const user = await this.authService.verifyAsync(token, 'admin');

			// 使用TypeORM查询用户及其角色
			const foundUser = await this.adminUserRepository.findOne({
				where: { id: parseInt(user.userId) }
			});

			if (!foundUser || !foundUser.roles.length) {
				return false;
			}

			// 获取用户的所有有效角色
			const roles = await this.adminRoleRepository.find({
				where: {
					id: In(foundUser.roles.map(roleId => Number(roleId))),
					status: '0'  // 只查询启用状态的角色
				}
			});

			if (!roles.length) {
				return false;
			}


			// 合并所有角色的权限
			const userPermissions = roles.reduce((permissions, role) => {
				return [...permissions, ...role.permissions];
			}, [] as string[]);
			if (!userPermissions.length) {
				return false;
			}

			// 获取当前方法的权限key
			let permissionKey = Reflect.getMetadata(PERMISSION_KEY, context.getHandler());
			if (!permissionKey) {
				permissionKey = context.getHandler().name
			}
			const needPermission = `${permissionGroup}.${permissionKey}`;

			// 检查是否包含所需的角色权限
			return userPermissions.includes('root') || userPermissions.includes(needPermission);
		} catch (error) {
			return false;
		}
	}
}
