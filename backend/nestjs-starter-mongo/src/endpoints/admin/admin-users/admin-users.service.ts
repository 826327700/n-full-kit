import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { LoginAdminUserDto } from './dto/login-admin-user.dto';
import { AdminUser, AdminUserDocument } from './entities/admin-user.entity';
import { AdminRole, AdminRoleDocument } from './entities/admin-role.entity';
import { AdminPermission, AdminPermissionDocument } from './entities/admin-permission.entity';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { AuthService } from 'src/common/modules/auth/auth.service';
import { QueryAdminUserDto } from './dto/query-admin-user.dto';

@Injectable()
export class AdminUsersService {
	constructor(
		@InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
		@InjectModel(AdminRole.name) private adminRoleModel: Model<AdminRoleDocument>,
		@InjectModel(AdminPermission.name) private adminPermissionModel: Model<AdminPermissionDocument>,
		private readonly authService: AuthService,
	) { }

	async create(createAdminUserDto: CreateAdminUserDto): Promise<string> {
		const existingUser = await this.adminUserModel.findOne({ username: createAdminUserDto.username });
		if (existingUser) {
			throw new ConflictException('Username already exists');
		}

		const hashedPassword = await bcrypt.hash(createAdminUserDto.password, 10);
		const createdUser = new this.adminUserModel({
			...createAdminUserDto,
			password: hashedPassword,
		});
		await createdUser.save();
		return 'ok';
	}

	async createRoot(): Promise<string> {
		const existingRoot = await this.adminUserModel.findOne({ username: 'root' });
		if (existingRoot) {
			throw new ConflictException('超级管理员已存在');
		}

		const hashedPassword = await bcrypt.hash('root123', 10);

		let rootRole = await this.adminRoleModel.findOne({ name: '超级管理员', permissions: { $in: ['root'] }, status: '0' })
		if (!rootRole) {
			rootRole = new this.adminRoleModel({
				name: '超级管理员',
				description: '超级管理员',
				permissions: ['root'],
				status: '0'
			});
		}
		const rootUser = new this.adminUserModel({
			username: 'root',
			password: hashedPassword,
			roles: [rootRole._id],
			status: '0'
		});
		await rootRole.save();
		await rootUser.save();
		return 'ok';
	}

	async findAll(query: QueryAdminUserDto) {
		let filter = {};
		if (query.keyword) {
			let regex = new RegExp(query.keyword, 'i');
			filter['$or'] = [
				{ nickname: regex },
				{ username: regex },
			];
		}
		const total = await this.adminUserModel.countDocuments(filter);

		const skip = (query.page - 1) * query.pageSize;

		const list = await this.adminUserModel.aggregate([
			{ $match: filter },
			{ $sort: { _id: -1 } },
			{ $skip: skip },
			{ $limit: Number(query.pageSize) },
			{
				$addFields: {
				  roles: { $map: {
					  input: "$roles",
					  as: "role",
					  in: { $toObjectId: "$$role" } // 将字符串转换为 ObjectId
					}
				  }
				}
			},
			{
				$lookup: {
					from: 'admin_roles', // MongoDB 中的实际集合名
					localField: 'roles',
					foreignField: '_id',
					as: 'roles'
				}
			},
			{
				$project: {
					password: 0,
					'roles._id': 0,
					'roles.permissions': 0,
					'roles.createdAt': 0,
					'roles.updatedAt': 0,
					'roles.__v': 0
				}
			}
		]);

		return {
			list,
			total,
			page: Number(query.page),
			pageSize: Number(query.pageSize),
		}
	}

	async findOne(id: string): Promise<AdminUser> {
		const user = await this.adminUserModel.findById(id).select('-password').exec();
		if (!user) {
			throw new NotFoundException(`Admin user with ID ${id} not found`);
		}
		return user;
	}

	async update(id: string, updateAdminUserDto: UpdateAdminUserDto): Promise<string> {
		if (updateAdminUserDto.password) {
			updateAdminUserDto.password = await bcrypt.hash(updateAdminUserDto.password, 10);
		}

		const updatedUser = await this.adminUserModel
			.findByIdAndUpdate(id, updateAdminUserDto, { new: true })
			.select('-password')
			.exec();

		if (!updatedUser) {
			throw new NotFoundException(`Admin user with ID ${id} not found`);
		}
		return 'ok';
	}

	async remove(id: string): Promise<string> {
		const result = await this.adminUserModel.findByIdAndDelete(id).exec();
		if (!result) {
			throw new NotFoundException(`Admin user with ID ${id} not found`);
		}
		return 'ok'
	}

	async login(loginAdminUserDto: LoginAdminUserDto) {
		const user = await this.adminUserModel.findOne({
			username: loginAdminUserDto.username,
			status: '0' // 只允许状态为0的用户登录
		}).exec();

		if (!user) {
			throw new UnauthorizedException('用户名或密码错误');
		}

		const isPasswordValid = await bcrypt.compare(loginAdminUserDto.password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('用户名或密码错误');
		}

		// 使用 AuthService 生成 token
		const { access_token } = this.authService.generateToken({
			userId: user._id.toString(),
			roles: user.roles,
			customData: {
				username: user.username
			}
		}, 'admin');

		return {
			access_token,
			user: {
				id: user._id,
				username: user.username,
				roles: user.roles
			}
		};
	}

	async createRole(createAdminRoleDto: CreateAdminRoleDto): Promise<string> {
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
			permissions: createAdminRoleDto.permissions || [],
			status: '0' // 默认状态为启用
		});
		await role.save();
		return 'ok' ;
	}
}
