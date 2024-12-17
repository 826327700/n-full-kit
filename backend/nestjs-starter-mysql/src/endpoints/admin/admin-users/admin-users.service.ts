import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { LoginAdminUserDto } from './dto/login-admin-user.dto';
import { AdminUser } from './entities/admin-user.entity';
import { AdminRole } from './entities/admin-role.entity';
import { AdminPermission } from './entities/admin-permission.entity';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { AuthService } from 'src/common/modules/auth/auth.service';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(AdminUser)
    private adminUserRepository: Repository<AdminUser>,
    @InjectRepository(AdminRole)
    private adminRoleRepository: Repository<AdminRole>,
    @InjectRepository(AdminPermission)
    private adminPermissionRepository: Repository<AdminPermission>,
    private readonly authService: AuthService,
  ) { }

  async create(createAdminUserDto: CreateAdminUserDto): Promise<AdminUser> {
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

  async createRoot(): Promise<AdminUser> {
    const existingRoot = await this.adminUserRepository.findOne({
      where: { username: 'root' }
    });
    if (existingRoot) {
      throw new ConflictException('超级管理员已存在');
    }

    const hashedPassword = await bcrypt.hash('root123', 10);
    
    let rootRole = await this.adminRoleRepository.findOne({ 
      where: { 
        name: '超级管理员',
        permissions: Like('%root%'),
        status: '0'
      }
    });
    
    if(!rootRole){
      rootRole = this.adminRoleRepository.create({
        name: '超级管理员',
        description: '超级管理员',
        permissions: ['root'],
        status: '0'
      });
      await this.adminRoleRepository.save(rootRole);
    }

    const rootUser = this.adminUserRepository.create({
      username: 'root',
      password: hashedPassword,
      roles: [rootRole.id.toString()],
      status: '0'
    });
    
    return this.adminUserRepository.save(rootUser);
  }

  async findAll(): Promise<AdminUser[]> {
    return this.adminUserRepository.find({
      select: {
        password: false
      }
    });
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

  async update(id: number, updateAdminUserDto: UpdateAdminUserDto): Promise<AdminUser> {
    if (updateAdminUserDto.password) {
      updateAdminUserDto.password = await bcrypt.hash(updateAdminUserDto.password, 10);
    }

    const user = await this.adminUserRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`Admin user with ID ${id} not found`);
    }

    const updatedUser = this.adminUserRepository.merge(user, updateAdminUserDto);
    await this.adminUserRepository.save(updatedUser);

    // 返回时排除密码字段
    const { password, ...result } = updatedUser;
    return result as AdminUser;
  }

  async remove(id: number): Promise<void> {
    const result = await this.adminUserRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin user with ID ${id} not found`);
    }
  }

  async login(loginAdminUserDto: LoginAdminUserDto) {
    const user = await this.adminUserRepository.findOne({
      where: {
        username: loginAdminUserDto.username,
        status: '0'
      }
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(loginAdminUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const { access_token } = this.authService.generateToken({
      userId: user.id.toString(),
      roles: user.roles,
      customData: {
        username: user.username
      }
    }, 'admin');

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles
      }
    };
  }

  async createRole(createAdminRoleDto: CreateAdminRoleDto): Promise<AdminRole> {
    const existingRole = await this.adminRoleRepository.findOne({
      where: { name: createAdminRoleDto.name }
    });
    
    if (existingRole) {
      throw new ConflictException('角色名已存在');
    }

    if (createAdminRoleDto.permissions && createAdminRoleDto.permissions.length > 0) {
      const permissions = await this.adminPermissionRepository.find({
        where: {
          key: In(createAdminRoleDto.permissions)
        }
      });

      if (permissions.length !== createAdminRoleDto.permissions.length) {
        throw new BadRequestException('部分权限不存在');
      }
    }

    const role = this.adminRoleRepository.create({
      name: createAdminRoleDto.name,
      description: createAdminRoleDto.description || '',
      permissions: createAdminRoleDto.permissions || [],
      status: '0'
    });

    return this.adminRoleRepository.save(role);
  }
}
