import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { Reflector } from '@nestjs/core';
import { Auth, NoAuth } from 'src/common/decorators/auth.decorator';
import { CustomApiResponse } from 'src/common/decorators/api-response.decorator';
import { PageQueryDto } from 'src/common/dto/page-query.dto';

@ApiTags('app端-增删改查示例(MySQL版)')
@ApiBearerAuth('JWT-auth')
@Controller('app/users')
@Auth()
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly reflector: Reflector,
	) { }

	@Post()
	@NoAuth()
	@ApiOperation({ summary: '创建用户' })
	@CustomApiResponse({
		type: User,
		description: '创建用户成功'
	})
	create(@Body() createUserDto: CreateUserDto) {

		return this.usersService.create(createUserDto);
	}

	@Post('login')
	@NoAuth()
	@ApiOperation({ summary: '用户登录' })
	@CustomApiResponse({
        type: User,
        description: '登录的用户'
    })
	login(@Body() loginDto: LoginDto) {
		return this.usersService.login(loginDto);
	}

	@Get()
	@ApiOperation({ summary: '分页获取用户列表' })
	@CustomApiResponse({
        type:User,
        description: '分页获取的用户列表',
		isPage:true
    })
	findAll(@Query() pageQueryDto: PageQueryDto) {
		return this.usersService.findAll(pageQueryDto);
	}

	@Get(':id')
	@ApiOperation({ summary: '根据ID获取用户' })
	@ApiParam({ name: 'id', description: '用户ID' })
	@CustomApiResponse({
        type: User,
        description: '获取的用户'
    })
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const user = await this.usersService.findOne(id);
		if (!user) {
			throw new NotFoundException(`用户ID ${id} 不存在`);
		}
		return user;
	}

	@Patch(':id')
	@ApiOperation({ summary: '根据ID更新用户' })
	@ApiParam({ name: 'id', description: '用户ID' })
	@CustomApiResponse({
        type: User,
        description: '更新的用户'
    })
	update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: '根据ID删除用户' })
	@ApiParam({ name: 'id', description: '用户ID' })
	@CustomApiResponse({
        type: Boolean,
        description: '删除成功'
    })
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.remove(id);
	}
}
