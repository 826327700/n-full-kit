import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AdminRolesService } from './admin-roles.service';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionGroup } from 'src/common/decorators/permission.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CustomApiResponse } from 'src/common/decorators/api-response.decorator';
import { createPageQueryResClass } from 'src/common/dto/page-query.dto';
import { AdminPermissionItemDto, AdminRoleDto, QueryAdminRoleDto } from './dto/query-admin-role.dto';
import { AdminMenuItem, UpdateAdminMenusDto } from './dto/update-admin-menu.dto';
import { JwtStrategys } from 'src/common/modules/auth/strategies/jwt.strategy';
import { ENDPOINTS } from 'src/common/constants/endpoints';

@ApiTags('admin端-管理员角色')
@Controller(`${ENDPOINTS.ADMIN}/roles`)
@PermissionGroup('admin-roles', '管理员角色管理')
@Auth(JwtStrategys.admin.name,true)
export class AdminRolesController {
	constructor(private readonly adminRolesService: AdminRolesService) { }

	// 创建角色
	@Post()
	@ApiOperation({ summary: '创建新管理员角色' })
  	@CustomApiResponse({
		type:String,
		example:"ok",
		description:"管理员角色创建成功",
	})
	async create(@Body() createAdminRoleDto: CreateAdminRoleDto){
		return this.adminRolesService.create(createAdminRoleDto);
	}

	// 获取所有角色
	@Get()
	@ApiOperation({ summary: '获取所有管理员角色' })
	@CustomApiResponse({
		type:createPageQueryResClass(AdminRoleDto),
		description:"返回所有管理员角色列表",
	})
	async findAll(@Query() query: QueryAdminRoleDto) {
		return this.adminRolesService.findAll(query);
	}

	// 根据 ID 获取角色
	@Get('role/:id')
	@ApiOperation({ summary: '根据ID获取管理员角色' })
	@CustomApiResponse({
		type:AdminRoleDto,
		description:"管理员返回指定的管理员角色信息登录成功",
	})
	async findOne(@Param('id') id: string) {
		return this.adminRolesService.findOne(id);
	}

	// 更新角色
	@Patch('role/:id')
	@ApiOperation({ summary: '更新管理员角色信息' })
	@CustomApiResponse({
		type:String,
		example:"ok",
		description:"管理员角色信息更新成功",
	})
	async update(@Param('id') id: string, @Body() updateAdminRoleDto: UpdateAdminRoleDto) {
		return this.adminRolesService.update(id, updateAdminRoleDto);
	}

	// 删除角色
	@Delete('role/:id')
	@ApiOperation({ summary: '删除管理员角色' })
	@CustomApiResponse({
		type:String,
		example:"ok",
		description:"管理员角色删除成功",
	})
	async remove(@Param('id') id: string) {
		return this.adminRolesService.remove(id);
	}

	//获取所有可选权限
	@Get('permissions')
	@ApiOperation({ summary: '获取所有可选权限' })
	@CustomApiResponse({
		type:AdminPermissionItemDto,
		description:"返回所有可选权限",
		isList:true
	})
	async findAllPermissions(){
		return this.adminRolesService.findAllPermissions();
	}

	//更新所有菜单
	@Post('menus')
	@ApiOperation({ summary: '更新所有菜单' })
	@CustomApiResponse({
		type:String,
		example:"ok",
		description:"菜单更新成功",
	})
	async updateAllMenus(@Body() updateAdminMenusDto: UpdateAdminMenusDto) {
		return this.adminRolesService.updateAllMenus(updateAdminMenusDto);
	}

	//获取所有菜单
	@Get('menus')
	@ApiOperation({ summary: '获取所有菜单' })
	@CustomApiResponse({
		type:AdminMenuItem,
		description:"返回所有菜单",
		isList:true
	})
	async findAllMenus(){
		return this.adminRolesService.findAllMenus();
	}
}
