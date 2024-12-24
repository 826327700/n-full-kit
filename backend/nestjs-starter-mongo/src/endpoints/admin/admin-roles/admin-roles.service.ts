import { BadRequestException, ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminRole, AdminRoleDocument } from './entities/admin-role.entity';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';
import { QueryAdminRoleDto } from './dto/query-admin-role.dto';
import { AdminPermission, AdminPermissionDocument } from './entities/admin-permission.entity';
import { UpdateAdminMenusDto } from './dto/update-admin-menu.dto';
import { AdminMenu, AdminMenuDocument } from './entities/admin-menu.entity';

@Injectable()
export class AdminRolesService {
	constructor(
		@InjectModel(AdminRole.name) private adminRoleModel: Model<AdminRoleDocument>,
		@InjectModel(AdminPermission.name) private adminPermissionModel: Model<AdminPermissionDocument>,
		@InjectModel(AdminMenu.name) private adminMenuModel: Model<AdminMenuDocument>,
	) { }

	// 创建角色
	async create(createAdminRoleDto: CreateAdminRoleDto){
		// 检查角色名是否已存在
		const existingRole = await this.adminRoleModel.findOne({ name: createAdminRoleDto.name });
		if (existingRole) {
			throw new ConflictException('角色名已存在');
		}

		// 如果提供了权限ID，验证这些权限是否存在
		if (createAdminRoleDto.permissions && createAdminRoleDto.permissions.length > 0) {
			const permissions = await this.adminPermissionModel.find({
				key: { $in: createAdminRoleDto.permissions }
			});

			if (permissions.length !== createAdminRoleDto.permissions.length) {
				throw new BadRequestException('部分权限不存在');
			}
		}

		// 创建新角色
		const role = new this.adminRoleModel({
			name: createAdminRoleDto.name,
			description: createAdminRoleDto.description || '',
			menus: createAdminRoleDto.menus || [],
			permissions: createAdminRoleDto.permissions || [],
			status: '0' // 默认状态为启用
		});
		await role.save();
		return 'ok' ;
	}

	// 获取所有角色
	async findAll(query: QueryAdminRoleDto) {
		let filter = {
			name:{$ne:'超级管理员'}
		};
		if (query.keyword) {
			let regex = new RegExp(query.keyword, 'i');
			filter.name['$regex']=regex
		}
		const total = await this.adminRoleModel.countDocuments(filter);
		const list = await this.adminRoleModel.aggregate([
			{ $match: filter },
			{ $skip: (query.page - 1) * query.pageSize },
			{ $limit: query.pageSize },
			{
				$lookup: {
					from: 'admin_permissions',
					let: { permissionKeys: '$permissions' },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $in: ['$key', '$$permissionKeys'] },
										{ $ne: ['$status', '99'] }  // 排除已删除的权限
									]
								}
							}
						}
					],
					as: 'validPermissions'
				}
			},
			{
				$addFields: {
					permissions: '$validPermissions.key',  // 只保留存在的权限的key
					id: '$_id'
				}
			},
			{
				$project: {
					validPermissions: 0  // 移除临时字段
				}
			}
		]);

		return {
			list,
			total,
			page: Number(query.page),
			pageSize: Number(query.pageSize),
		};
	}

	// 根据 ID 获取角色
	async findOne(id: string) {
		return this.adminRoleModel.findById(id).exec();
	}

	// 更新角色
	async update(id: string, updateAdminRoleDto: UpdateAdminRoleDto){
		let oldDoc=await this.adminRoleModel.findById(id).exec();
		if(oldDoc.name!==updateAdminRoleDto.name){
			//检查角色名是否已存在
			const existingRole = await this.adminRoleModel.findOne({ name: updateAdminRoleDto.name,_id:{$ne:id} });
			if (existingRole) {
				throw new ConflictException('角色名已存在');
			}
		}
		Object.keys(updateAdminRoleDto).forEach(key => {
			if (!updateAdminRoleDto[key]) {
				delete updateAdminRoleDto[key];
			}
		});
		await this.adminRoleModel.findByIdAndUpdate(id, {$set:updateAdminRoleDto});
		return 'ok'
	}

	// 删除角色
	async remove(id: string){
		await this.adminRoleModel.findByIdAndDelete(id);
		return 'ok'
	}

	// 获取所有可选权限
	async findAllPermissions() {
		return this.adminPermissionModel.find({ status: '0',key:{$nin:['admin-users.createRoot','admin-roles.findAllPermissions']} }).exec();
	}

	// 更新所有菜单
	async updateAllMenus(updateAdminMenusDto: UpdateAdminMenusDto) {
		await this.adminMenuModel.deleteMany({});
		await this.adminMenuModel.insertMany(updateAdminMenusDto.menus);
		return 'ok';
	}

	// 获取所有菜单
	async findAllMenus() {
		return this.adminMenuModel.find().exec();
	}
}
