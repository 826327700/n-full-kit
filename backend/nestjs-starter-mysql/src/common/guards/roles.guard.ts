import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NO_CHECK_ROLES_KEY } from '../decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AdminUser } from 'src/endpoints/admin/admin-users/entities/admin-user.entity';
import { PERMISSION_GROUP_KEY, PERMISSION_KEY } from '../decorators/permission.decorator';
import { getPermissionKey } from '../modules/permission-collect/permission-collect.service';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		@InjectRepository(AdminUser)
		private adminUserRepository: Repository<AdminUser>,
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

		const userWithPermissions = await this.adminUserRepository
		.createQueryBuilder('user')
		.leftJoinAndSelect('admin_roles', 'role', 'JSON_CONTAINS(user.roles, CAST(role.id AS JSON), "$")')
		.where('user.id = :userId', { userId: request.user.userId })
		.select(['user.id', 'role.permissions'])
		.getRawOne();

		const userPermissions=JSON.parse(userWithPermissions.role_permissions||[])

		// 获取当前方法的权限key
		//@ts-ignore
		let needPermission = Reflect.getMetadata(PERMISSION_KEY, context.getHandler()) || getPermissionKey(context.getRequest().url, context.getClass().name, context.getHandler().name)

		// 检查是否包含所需的角色权限
		if (userPermissions.includes('root') || userPermissions.includes(needPermission)) {
			return true
		} else {
			throw new ForbiddenException('无权访问');
		}
	}
}
