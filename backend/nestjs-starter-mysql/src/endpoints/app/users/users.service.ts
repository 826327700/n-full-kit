import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { PageQueryDto } from '../../../common/dto/page-query.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '../../../common/modules/auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly authService: AuthService,
    ) { }

    async create(createUserDto: CreateUserDto) {
        // 检查用户名是否已存在
        const existingUser = await this.usersRepository.findOne({
            where: { username: createUserDto.username },
        });
        if (existingUser) {
            throw new ConflictException('用户名已存在');
        }

        // 创建新用户
        const user = this.usersRepository.create(createUserDto);

        // 加密密码
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);

        // 保存用户
        return this.usersRepository.save(user);
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersRepository.findOne({
            where: { username: loginDto.username },
        });

        if (!user) {
            throw new UnauthorizedException('用户名或密码错误');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('用户名或密码错误');
        }

        // 使用 AuthService 生成 token
        const { access_token } = this.authService.generateToken({
            userId: user.id.toString(),
            roles: [user.role],
            customData: {
                username: user.username
            }
        });

        return {
            access_token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        };
    }

    async findAll(query: PageQueryDto) {
        const [list, total] = await this.usersRepository.findAndCount({
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
            select: ['id', 'username', 'role', 'createdAt', 'updatedAt'],
        });

        return {
            list,
            total,
            page: query.page,
            pageSize: query.pageSize,
        };
    }

    async findOne(id: number) {
        return this.usersRepository.findOne({
            where: { id },
            select: ['id', 'username', 'role', 'createdAt', 'updatedAt'],
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('用户不存在');
        }

        // 如果要更新用户名，检查新用户名是否已存在
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUser = await this.usersRepository.findOne({
                where: { username: updateUserDto.username },
            });
            if (existingUser) {
                throw new ConflictException('用户名已存在');
            }
        }

        // 如果要更新密码，需要加密
        if (updateUserDto.password) {
            const salt = await bcrypt.genSalt();
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
        }

        // 更新用户
        await this.usersRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const result = await this.usersRepository.delete(id);
        return result.affected > 0;
    }
}
