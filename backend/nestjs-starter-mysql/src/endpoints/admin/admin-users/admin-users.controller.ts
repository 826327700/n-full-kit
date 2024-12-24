import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { LoginAdminUserDto, LoginAdminUserResDto, UserInfo } from './dto/login-admin-user.dto';
import { Auth, NoAuth } from 'src/common/decorators/auth.decorator';
import { PermissionGroup } from 'src/common/decorators/permission.decorator';
import { NoCheckRoles } from 'src/common/decorators/roles.decorator';
import { CustomApiResponse } from 'src/common/decorators/api-response.decorator';
import { createPageQueryResClass } from 'src/common/dto/page-query.dto';
import { AdminUserDto, QueryAdminUserDto } from './dto/query-admin-user.dto';
import { IRequest } from 'src/common/interfaces/request';
import { ENDPOINTS } from 'src/common/constants/endpoints';
import { JwtStrategys } from 'src/common/modules/auth/strategies/jwt.strategy';

@ApiTags('admin端-管理员用户')
@Controller(`${ENDPOINTS.ADMIN}/users`)
@PermissionGroup('admin-users', '管理员用户管理')
@Auth(JwtStrategys.admin.name, true)
export class AdminUsersController {
	constructor(private readonly adminUsersService: AdminUsersService) { }

	@Post('root')
	@NoAuth()
	@ApiOperation({ summary: '创建超级管理员' })
	@CustomApiResponse({
		type: String,
		example: "ok",
		description: "超级管理员创建成功",
	})
	@NoCheckRoles()
	createRoot() {
		return this.adminUsersService.createRoot();
	}

	@Post('login')
	@NoAuth()
	@NoCheckRoles()
	@ApiOperation({ summary: '管理员登录' })
	@CustomApiResponse({
		type: LoginAdminUserResDto,
		description: "管理员登录成功",
	})
	login(@Body() loginAdminUserDto: LoginAdminUserDto) {
		return this.adminUsersService.login(loginAdminUserDto);
	}

	@Get('login-info')
	@NoCheckRoles()
	@ApiOperation({ summary: '获取管理员登录信息' })
	@CustomApiResponse({
		type: UserInfo,
		description: "获取管理员登录信息成功",
	})
	getLoginInfo(@Req() req: IRequest) {
		return this.adminUsersService.getLoginInfo(req);
	}

	@Post()
	@ApiOperation({ summary: '创建新管理员用户' })
	@CustomApiResponse({
		type: String,
		example: "ok",
		description: "管理员用户创建成功",
	})
	create(@Body() createAdminUserDto: CreateAdminUserDto) {
		return this.adminUsersService.create(createAdminUserDto);
	}

	@Get()
	@ApiOperation({ summary: '获取所有管理员用户' })
	@CustomApiResponse({
		type: createPageQueryResClass(AdminUserDto),
		description: "返回所有管理员用户列表",
	})
	findAll(@Query() query: QueryAdminUserDto) {
		return this.adminUsersService.findAll(query);
	}

	@Patch(':id')
	@ApiOperation({ summary: '更新管理员用户信息' })
	@CustomApiResponse({
		type: String,
		example: "ok",
		description: "管理员用户信息更新成功",
	})
	update(@Param('id') id: string, @Body() updateAdminUserDto: UpdateAdminUserDto) {
		return this.adminUsersService.update(+id, updateAdminUserDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: '删除管理员用户' })
	@CustomApiResponse({
		type: String,
		example: "ok",
		description: "管理员用户删除成功",
	})
	remove(@Param('id') id: string) {
		return this.adminUsersService.remove(+id);
	}
}