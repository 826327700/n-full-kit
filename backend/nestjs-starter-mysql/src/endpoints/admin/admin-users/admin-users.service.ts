import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Like, Not, Raw, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { LoginAdminUserDto } from './dto/login-admin-user.dto';
import { AdminUser } from './entities/admin-user.entity';
import { AuthService } from 'src/common/modules/auth/auth.service';
import { QueryAdminUserDto } from './dto/query-admin-user.dto';
import { AdminRole } from '../admin-roles/entities/admin-role.entity';
import { AdminPermission } from '../admin-roles/entities/admin-permission.entity';
import { AdminMenu } from '../admin-roles/entities/admin-menu.entity';
import { IRequest } from 'src/common/interfaces/request';

@Injectable()
export class AdminUsersService {
	constructor(
		@InjectRepository(AdminUser)
		private adminUserRepository: Repository<AdminUser>,
		@InjectRepository(AdminRole)
		private adminRoleRepository: Repository<AdminRole>,
		@InjectRepository(AdminPermission)
		private adminPermissionRepository: Repository<AdminPermission>,
		@InjectRepository(AdminMenu)
		private adminMenuRepository: Repository<AdminMenu>,
		private readonly authService: AuthService,
	) { }

	async create(createAdminUserDto: CreateAdminUserDto) {
		const existingUser = await this.adminUserRepository.findOne({
			where: { username: createAdminUserDto.username }
		});
		if (existingUser) {
			throw new ConflictException('Username already exists');
		}

		const hashedPassword = await bcrypt.hash(createAdminUserDto.password, 10);
		const user = this.adminUserRepository.create({
			...createAdminUserDto,
			password: hashedPassword,
		});
		return this.adminUserRepository.save(user);
	}

	async createRoot() {
		const existingRoot = await this.adminUserRepository.findOne({
			where: { username: 'root' }
		});
		if (existingRoot) {
			throw new ConflictException('超级管理员已存在');
		}

		const hashedPassword = await bcrypt.hash('root123', 10);

		let rootRole = await this.adminRoleRepository.createQueryBuilder('role')
			.where('role.name = :name', { name: '超级管理员' })
			.andWhere(`JSON_CONTAINS(role.permissions, '"root"')`)
			.andWhere('role.status = :status', { status: '0' })
			.getOne();

		if (!rootRole) {
			rootRole = this.adminRoleRepository.create({
				name: '超级管理员',
				description: '超级管理员',
				permissions: ['root'],
				status: '0'
			});
			await this.adminRoleRepository.save(rootRole);
		}

		const rootUser = this.adminUserRepository.create({
			nickname: '超级管理员',
			username: 'root',
			password: hashedPassword,
			roles: [rootRole.id.toString()],
			status: '0'
		});

		return this.adminUserRepository.save(rootUser);
	}

	async findAll(query: QueryAdminUserDto) {
		const qb = this.adminUserRepository.createQueryBuilder('adminUser')
			.where('adminUser.status != :status', { status: '99' })
			.andWhere('adminUser.username != :username', { username: 'root' });

		if (query.keyword) {
			qb.andWhere(new Brackets(qb => {
				qb.where('adminUser.nickname LIKE :nickname', { nickname: `%${query.keyword}%` })
					.orWhere('adminUser.username LIKE :username', { username: `%${query.keyword}%` });
			}));
		}

		const total = await qb.getCount();
		const skip = (query.page - 1) * query.pageSize;

		const users = await qb
			.orderBy('adminUser.id', 'DESC')
			.skip(skip)
			.take(query.pageSize)
			.getMany();

		// 手动查询角色
		const userIds = users.map(user => user.id);
		const roles = await this.adminRoleRepository.find({
			where: { id: In(userIds), status: '0' }
		});

		// 处理用户与角色的映射
		const userRolesMap = roles.reduce((acc, role) => {
			acc[role.id] = role; // 将角色 ID 作为键
			return acc;
		}, {});

		// 为每个用户添加角色信息
		const result = users.map(user => ({
			...user,
			roles: userRolesMap[user.id] ? userRolesMap[user.id].name : null // 根据需要选择角色属性
		}));

		return {
			total,
			list: result,
			page: Number(query.page),
			pageSize: Number(query.pageSize),
		};
	}

	async findOne(id: number): Promise<AdminUser> {
		const user = await this.adminUserRepository.findOne({
			where: { id },
			select: {
				password: false
			}
		});
		if (!user) {
			throw new NotFoundException(`Admin user with ID ${id} not found`);
		}
		return user;
	}

	async update(id: number, updateAdminUserDto: UpdateAdminUserDto): Promise<string> {
		if (updateAdminUserDto.password) {
			updateAdminUserDto.password = await bcrypt.hash(updateAdminUserDto.password, 10);
		}else{
			delete updateAdminUserDto.password
		}
		
		// 查找用户并更新
		const user = await this.adminUserRepository.findOne({
			where: { id }
		});
		
		if (!user) {
			throw new NotFoundException(`Admin user with ID ${id} not found`);
		}
		
		// 使用 TypeORM 的 update 方法更新用户信息
		await this.adminUserRepository.update(id, updateAdminUserDto);
		
		return 'ok';
	}

	async remove(id: number): Promise<string> {
		await this.adminUserRepository.update(id, { status: '99' });
		return 'ok';
	}

	async login(loginAdminUserDto: LoginAdminUserDto) {
		const user = await this.adminUserRepository.findOne({
			where: {
				username: loginAdminUserDto.username,
				status: Not('99')
			}
		});

		if (!user) {
			throw new NotFoundException('用户名不存在');
		}

		if (user.status === '1') {
			throw new ForbiddenException('该用户已被禁用');
		}

		const isPasswordValid = await bcrypt.compare(loginAdminUserDto.password, user.password);

		if (!isPasswordValid) {
			throw new ForbiddenException('用户名或密码错误');
		}

		const { access_token } = this.authService.generateToken({
			userId: user.id.toString(),
			roles: user.roles,
			customData: {
				username: user.username
			}
		}, 'admin');

		let roles = await this.adminRoleRepository.find({
			where: { id: In(user.roles), status: '0' }
		});
		let menus = roles.reduce((acc, role) => {
			acc.push(...role.menus);
			return acc;
		}, []);
		let permissions = roles.reduce((acc, role) => {
			acc.push(...role.permissions);
			return acc;
		}, []);
		if (permissions.includes('root')) {
			let rootMenusAndPermissions = await this.getRootMenusAndPermissions();
			menus = rootMenusAndPermissions.menus;
			permissions = rootMenusAndPermissions.permissions;
		}

		return {
			access_token,
			user: {
				id: user.id,
				nickname: user.nickname,
				menus,
				permissions
			}
		};
	}

	async getLoginInfo(req: IRequest) {
		let user = await this.adminUserRepository.findOne({
			where: { id: Number(req.user.userId) },
			select: ['id', 'nickname', 'roles']
		});

		let roles = await this.adminRoleRepository.find({
			where: { id: In(user.roles), status: '0' }
		});

		let menus = roles.reduce((acc, role) => {
			acc.push(...role.menus);
			return acc;
		}, []);

		let permissions = roles.reduce((acc, role) => {
			acc.push(...role.permissions);
			return acc;
		}, []);

		if (permissions.includes('root')) {
			let rootMenusAndPermissions = await this.getRootMenusAndPermissions();
			menus = rootMenusAndPermissions.menus;
			permissions = rootMenusAndPermissions.permissions;
		}

		return {
			id: user.id,
			nickname: user.nickname,
			menus,
			permissions
		};
	}

	async getRootMenusAndPermissions() {
		let menus = [];
		let permissions = [];

		// 获取所有状态为 '0' 的菜单
		const allMenuDocs = await this.adminMenuRepository.find({ where: { status: '0' } });
		menus = allMenuDocs.map(item => item.name);

		// 获取所有状态为 '0' 的权限
		const allPermissions = await this.adminPermissionRepository.find({ where: { status: '0' } });
		permissions = allPermissions.map(item => item.key);

		return {
			menus,
			permissions
		};
	}
}
