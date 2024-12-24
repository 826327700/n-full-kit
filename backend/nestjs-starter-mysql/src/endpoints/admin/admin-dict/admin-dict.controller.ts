import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminDictService } from './admin-dict.service';
import { CreateAdminDictDto } from './dto/create-admin-dict.dto';
import { UpdateAdminDictDto } from './dto/update-admin-dict.dto';
import { AdminDictDto } from './dto/admin-dict.dto';
import { CustomApiResponse } from 'src/common/decorators/api-response.decorator';
import { createPageQueryResClass } from 'src/common/dto/page-query.dto';
import { CreateAdminDictTypeDto } from './dto/create-admin-dict-type.dto';
import { UpdateAdminDictTypeDto } from './dto/update-admin-dict-type.dto';
import { QueryAdminDictTypeDto } from './dto/query-admin-dict-type.dto';
import { AdminDictTypeDto } from './dto/admin-dict-type.dto';
import { PermissionGroup } from 'src/common/decorators/permission.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ENDPOINTS } from 'src/common/constants/endpoints';
import { JwtStrategys } from 'src/common/modules/auth/strategies/jwt.strategy';

@ApiTags('admin端-字典管理')
@Controller(`${ENDPOINTS.ADMIN}/dict`)
@PermissionGroup('admin-dict', '字典管理')
@Auth(JwtStrategys.admin.name,true)
export class AdminDictController {
    constructor(private readonly adminDictService: AdminDictService) {}

    // 字典类型相关接口
    @Post('type')
    @ApiOperation({ summary: '创建字典类型' })
    @CustomApiResponse({
        type: String,
        example: "ok",
        description: "字典类型创建成功",
    })
    createType(@Body() createAdminDictTypeDto: CreateAdminDictTypeDto) {
        return this.adminDictService.createType(createAdminDictTypeDto);
    }

    @Get('type')
    @ApiOperation({ summary: '查询字典类型列表' })
    @CustomApiResponse({
        type: createPageQueryResClass(AdminDictTypeDto),
        description: "返回字典类型列表",
    })
    findAllTypes(@Query() query: QueryAdminDictTypeDto) {
        return this.adminDictService.findAllTypes(query);
    }

    @Patch('type/:type')
    @ApiOperation({ summary: '更新字典类型' })
    @CustomApiResponse({
        type: String,
        example: "ok",
        description: "字典类型更新成功",
    })
    updateType(
        @Param('type') type: string,
        @Body() updateAdminDictTypeDto: UpdateAdminDictTypeDto,
    ) {
        return this.adminDictService.updateType(type, updateAdminDictTypeDto);
    }

    @Delete('type/:type')
    @ApiOperation({ summary: '删除字典类型' })
    @CustomApiResponse({
        type: String,
        example: "ok",
        description: "字典类型删除成功",
    })
    removeType(@Param('type') type: string) {
        return this.adminDictService.removeType(type);
    }

    // 字典项相关接口
    @Post()
    @ApiOperation({ summary: '创建字典项' })
    @CustomApiResponse({
        type: String,
        example: "ok",
        description: "字典项创建成功",
    })
    create(@Body() createAdminDictDto: CreateAdminDictDto) {
        return this.adminDictService.create(createAdminDictDto);
    }

    @Get('items/:type')
    @ApiOperation({ summary: '根据类型获取字典项' })
    @CustomApiResponse({
        type: AdminDictDto,
        description: "返回指定类型的所有字典项",
        isList: true
    })
    findByType(@Param('type') type: string) {
        return this.adminDictService.findByType(type);
    }

    @Patch(':type/:code')
    @ApiOperation({ summary: '更新字典项' })
    @CustomApiResponse({
        type: String,
        example: "ok",
        description: "字典项更新成功",
    })
    update(
        @Param('type') type: string,
        @Param('code') code: string,
        @Body() updateAdminDictDto: UpdateAdminDictDto,
    ) {
        return this.adminDictService.update(type, code, updateAdminDictDto);
    }

    @Delete(':type/:code')
    @ApiOperation({ summary: '删除字典项' })
    @CustomApiResponse({
        type: String,
        example: "ok",
        description: "字典项删除成功",
    })
    remove(@Param('type') type: string, @Param('code') code: string) {
        return this.adminDictService.remove(type, code);
    }
}
