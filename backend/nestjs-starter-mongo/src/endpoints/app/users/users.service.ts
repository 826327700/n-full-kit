import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserSchema } from './entities/user.schema';
import { AuthService } from '../../../common/modules/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { PageQueryDto } from '../../../common/dto/page-query.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserSchema.name) private userModel: Model<UserDocument>,
        private readonly authService: AuthService,
    ) { }

    async create(createUserDto: CreateUserDto) {
        // 检查用户名是否已存在
        const existingUser = await this.userModel.findOne({ username: createUserDto.username }).exec();
        if (existingUser) {
            throw new ConflictException('用户名已存在');
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        // 创建新用户
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });

        return createdUser.save();
    }

    async login(loginDto: LoginDto) {
        // 查找用户
        const user = await this.userModel.findOne<UserDocument>({ username: loginDto.username }).exec();
        if (!user) {
            throw new NotFoundException('用户不存在');
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new NotFoundException('用户名或密码错误');
        }

        // 生成 token
        const token = await this.authService.generateToken({
            userId: user._id.toString(),
            roles: [user.role],
            customData: {
                username: user.username
            }
        });

        return { ...user.toJSON(), token };
    }

    async findAll(query: PageQueryDto) {
        const { page = 1, pageSize = 10 } = query;
        const skip = (page - 1) * pageSize;

        const [total, list] = await Promise.all([
            this.userModel.countDocuments().exec(),
            this.userModel.find()
                .skip(skip)
                .limit(pageSize)
                .exec(),
        ]);

        return {
            list,
            total,
            page: Number(page),
            pageSize: Number(pageSize),
        };
    }

    async findOne(id: string) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`用户ID ${id} 不存在`);
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        // 如果更新包含密码，需要加密
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const user = await this.userModel.findByIdAndUpdate(
            id,
            { $set: updateUserDto },
            { new: true },
        ).exec();

        if (!user) {
            throw new NotFoundException(`用户ID ${id} 不存在`);
        }

        return user;
    }

    async remove(id: string) {
        const user = await this.userModel.findByIdAndDelete(id).exec();
        if (!user) {
            throw new NotFoundException(`用户ID ${id} 不存在`);
        }
        return user;
    }
}
