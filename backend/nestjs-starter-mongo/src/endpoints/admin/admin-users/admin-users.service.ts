import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { LoginAdminUserDto } from './dto/login-admin-user.dto';
import { AdminUser, AdminUserDocument } from './entities/admin-user.entity';
import { AdminRole, AdminRoleDocument } from '../admin-roles/entities/admin-role.entity';
import { AdminPermission, AdminPermissionDocument } from '../admin-roles/entities/admin-permission.entity';
import { AuthService } from 'src/common/modules/auth/auth.service';
import { QueryAdminUserDto } from './dto/query-admin-user.dto';
import { AdminMenu, AdminMenuDocument } from '../admin-roles/entities/admin-menu.entity';
import { IRequest } from 'src/common/interfaces/request';

@Injectable()
export class AdminUsersService {
	constructor(
		@InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
		@InjectModel(AdminRole.name) private adminRoleModel: Model<AdminRoleDocument>,
		@InjectModel(AdminPermission.name) private adminPermissionModel: Model<AdminPermissionDocument>,
		@InjectModel(AdminMenu.name) private adminMenuModel: Model<AdminMenuDocument>,
		private readonly authService: AuthService,
	) { }

	async create(createAdminUserDto: CreateAdminUserDto): Promise<string> {
		const existingUser = await this.adminUserModel.findOne({ username: createAdminUserDto.username });
		if (existingUser) {
			throw new ConflictException('用户名已存在');
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
		let filter = {
			status:{$ne:'99'}
		};
		if (query.keyword) {
			let regex = new RegExp(query.keyword, 'i');
			filter['$or'] = [
				{ nickname: regex },
				{ username: regex },
			];
		}

		let superRole = await this.adminRoleModel.findOne({ name: '超级管理员', permissions: { $in: ['root'] }, status: '0' })

		if(superRole){
			filter["roles"]={$nin:[superRole._id.toString()]}
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
					let: { roles: '$roles' },
					pipeline: [
						{ $match: { $expr: { $and: [ { $in: [ '$_id', '$$roles' ] }, { $eq: ['$status', '0'] } ] } } } ,
						{ $addFields:{id:'$_id'}},
					],
					as: 'roles'
				}
			},
			{
				$project: {
					password: 0,
					'roles.permissions': 0,
					'roles.createdAt': 0,
					'roles.updatedAt': 0,
					'roles.__v': 0
				}
			},
			{
				$addFields:{
					id:'$_id',
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
		}else{
			delete updateAdminUserDto.password
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
		await this.adminUserModel.findByIdAndUpdate(id, {$set:{status:'99'}});
		return 'ok'
	}

	async login(loginAdminUserDto: LoginAdminUserDto) {
		const user = await this.adminUserModel.findOne({
			username: loginAdminUserDto.username,
			status: {$ne:'99'}
		}).exec();

		if (!user) {
			throw new NotFoundException('用户名不存在');
		}

		if(user.status === '1'){
			throw new ForbiddenException('该用户已被禁用');
		}

		const isPasswordValid = await bcrypt.compare(loginAdminUserDto.password, user.password);

		if (!isPasswordValid) {
			throw new ForbiddenException('用户名或密码错误');
		}

		// 使用 AuthService 生成 token
		const { access_token } = this.authService.generateToken({
			userId: user._id.toString(),
			roles: user.roles,
			customData: {
				username: user.username
			}
		}, 'admin');

		// 获取菜单
		let roles=await this.adminRoleModel.find({
			_id: { $in: user.roles },
			status: '0'
		})
		let menus =roles.reduce((acc, role) => {
			acc.push(...role.menus);
			return acc;
		}, []);
		let permissions =roles.reduce((acc, role) => {
			acc.push(...role.permissions);
			return acc;
		}, []);
		if(permissions.includes('root')){
			let rootMenusAndPermissions=await this.getRootMenusAndPermissions()
			menus=rootMenusAndPermissions.menus
			permissions=rootMenusAndPermissions.permissions
		}

		return {
			access_token,
			user: {
				id: user._id,
				nickname: user.nickname,
				menus,
				permissions
			}
		};
	}

	async getLoginInfo(req:IRequest) {
		let user=await this.adminUserModel.findById(req.user.userId).select('-password').exec()
		let roles=await this.adminRoleModel.find({
			_id: { $in: user.roles },
			status: '0'
		})
		let menus =roles.reduce((acc, role) => {
			acc.push(...role.menus);
			return acc;
		}, []);
		let permissions =roles.reduce((acc, role) => {
			acc.push(...role.permissions);
			return acc;
		}, []);
		if(permissions.includes('root')){
			let rootMenusAndPermissions=await this.getRootMenusAndPermissions()
			menus=rootMenusAndPermissions.menus
			permissions=rootMenusAndPermissions.permissions
		}
		return {
			id: user._id,
			nickname: user.nickname,
			menus,
			permissions
		}
	}

	private async getRootMenusAndPermissions() {
		let menus=[]
		let permissions=[]
		let allMenuDocs=await this.adminMenuModel.find({status:'0'})
		menus=allMenuDocs.map(item=>item.name)
		let allPermissions=await this.adminPermissionModel.find({status:'0'})
		permissions=allPermissions.map(item=>item.key)
		return {
			menus,
			permissions
		}
	}
}
