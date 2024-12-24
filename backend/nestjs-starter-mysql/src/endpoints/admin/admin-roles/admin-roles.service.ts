import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like, Not } from 'typeorm';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';
import { QueryAdminRoleDto } from './dto/query-admin-role.dto';
import { UpdateAdminMenusDto } from './dto/update-admin-menu.dto';
import { AdminRole } from './entities/admin-role.entity';
import { AdminPermission } from './entities/admin-permission.entity';
import { AdminMenu } from './entities/admin-menu.entity';

@Injectable()
export class AdminRolesService {
	constructor(
		@InjectRepository(AdminRole)
		private adminRoleRepository: Repository<AdminRole>,
		@InjectRepository(AdminPermission)
		private adminPermissionRepository: Repository<AdminPermission>,
		@InjectRepository(AdminMenu)
		private adminMenuRepository: Repository<AdminMenu>,
	) {}

	// 创建角色
	async create(createAdminRoleDto: CreateAdminRoleDto) {
		// 检查角色名是否已存在
		const existingRole = await this.adminRoleRepository.findOne({
			where: { name: createAdminRoleDto.name }
		});
		if (existingRole) {
			throw new ConflictException('角色名已存在');
		}

		// 如果提供了权限ID，验证这些权限是否存在
		if (createAdminRoleDto.permissions && createAdminRoleDto.permissions.length > 0) {
			const permissions = await this.adminPermissionRepository.find({
				where: { key: In(createAdminRoleDto.permissions) }
			});

			if (permissions.length !== createAdminRoleDto.permissions.length) {
				throw new BadRequestException('部分权限不存在');
			}
		}

		// 创建新角色
		const role = this.adminRoleRepository.create({
			name: createAdminRoleDto.name,
			description: createAdminRoleDto.description || '',
			menus: createAdminRoleDto.menus || [],
			permissions: createAdminRoleDto.permissions || [],
			status: '0' // 默认状态为启用
		});
		await this.adminRoleRepository.save(role);
		return 'ok';
	}

	// 获取所有角色
	async findAll(query: QueryAdminRoleDto) {
		let filter = {
			name: Not('超级管理员')
		};
		if (query.keyword) {
			let regex = new RegExp(query.keyword, 'i');
			filter.name = Like(`%${query.keyword}%`);
		}
		const total = await this.adminRoleRepository.count({ where: filter });
		const list = await this.adminRoleRepository.createQueryBuilder('role')
			.where(filter)
			.skip((query.page - 1) * query.pageSize)
			.take(query.pageSize)
			.getMany();
		return {
			list,
			total,
			page: Number(query.page),
			pageSize: Number(query.pageSize),
		};
	}

	// 根据 ID 获取角色
	async findOne(id: number) {
		return this.adminRoleRepository.findOne({ where: { id } });
	}

	// 更新角色
	async update(id: number, updateAdminRoleDto: UpdateAdminRoleDto) {
		let oldDoc = await this.adminRoleRepository.findOne({ where: { id } });
		if (oldDoc.name !== updateAdminRoleDto.name) {
			// 检查角色名是否已存在
			const existingRole = await this.adminRoleRepository.findOne({
				where: { name: updateAdminRoleDto.name, id: Not(id) }
			});
			if (existingRole) {
				throw new ConflictException('角色名已存在');
			}
		}
		await this.adminRoleRepository.update(id, updateAdminRoleDto);
		return 'ok';
	}

	// 删除角色
	async remove(id: string) {
		await this.adminRoleRepository.delete(id);
		return 'ok';
	}

	// 获取所有可选权限
	async findAllPermissions() {
		return this.adminPermissionRepository.find({ where: { status: '0', key: Not(In(['admin-users.createRoot', 'admin-roles.findAllPermissions'])) } });
	}

	// 更新所有菜单
	async updateAllMenus(updateAdminMenusDto: UpdateAdminMenusDto) {
		await this.adminMenuRepository.delete({});
		await this.adminMenuRepository.save(updateAdminMenusDto.menus);
		return 'ok';
	}

	// 获取所有菜单
	async findAllMenus() {
		return this.adminMenuRepository.find();
	}
}
