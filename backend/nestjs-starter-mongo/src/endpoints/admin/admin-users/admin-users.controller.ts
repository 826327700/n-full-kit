import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { LoginAdminUserDto, LoginAdminUserResDto } from './dto/login-admin-user.dto';
import { Auth, NoAuth } from 'src/common/decorators/auth.decorator';
import { PermissionGroup, PermissionKey } from 'src/common/decorators/permission.decorator';
import { CheckRoles, NoCheckRoles } from 'src/common/decorators/roles.decorator';
import { CustomApiResponse } from 'src/common/decorators/api-response.decorator';
import { createPageQueryResClass } from 'src/common/dto/page-query.dto';
import { AdminUserDto, QueryAdminUserDto } from './dto/query-admin-user.dto';

@ApiTags('admin端-管理员用户')
@Controller('admin/users')
@PermissionGroup('admin-users','管理员用户管理')
@Auth('admin')
@CheckRoles()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Post('root')
  @NoAuth()
  @ApiOperation({ summary: '创建超级管理员' })
  @CustomApiResponse({
		type:String,
		example:"ok",
		description:"超级管理员创建成功",
	})
  @NoCheckRoles()
  createRoot() {
    return this.adminUsersService.createRoot();
  }

  @Post()
  @ApiOperation({ summary: '创建新管理员用户' })
  @CustomApiResponse({
		type:String,
		example:"ok",
		description:"管理员用户创建成功",
	})
  create(@Body() createAdminUserDto: CreateAdminUserDto) {
    return this.adminUsersService.create(createAdminUserDto);
  }

  @Post('login')
  @NoAuth()
  @NoCheckRoles()
  @ApiOperation({ summary: '管理员登录' })
  @CustomApiResponse({
		type:LoginAdminUserResDto,
		description:"管理员登录成功",
	})
  login(@Body() loginAdminUserDto: LoginAdminUserDto) {
    return this.adminUsersService.login(loginAdminUserDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有管理员用户' })
  @CustomApiResponse({
		type:createPageQueryResClass(AdminUserDto),
		description:"返回所有管理员用户列表",
	})
  findAll(@Query() query: QueryAdminUserDto) {
    return this.adminUsersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取管理员用户' })
  @CustomApiResponse({
		type:AdminUserDto,
		description:"管理员登录成功",
	})
  findOne(@Param('id') id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新管理员用户信息' })
  @CustomApiResponse({
		type:String,
		example:"ok",
		description:"管理员用户信息更新成功",
	})
  update(@Param('id') id: string, @Body() updateAdminUserDto: UpdateAdminUserDto) {
    return this.adminUsersService.update(id, updateAdminUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除管理员用户' })
  @CustomApiResponse({
		type:String,
		example:"ok",
		description:"管理员用户删除成功",
	})
  remove(@Param('id') id: string) {
    return this.adminUsersService.remove(id);
  }
}
