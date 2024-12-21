import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminDictService } from './admin-dict.service';
import { CreateAdminDictDto } from './dto/create-admin-dict.dto';
import { UpdateAdminDictDto } from './dto/update-admin-dict.dto';
import { QueryAdminDictDto } from './dto/query-admin-dict.dto';
import { AdminDictDto } from './dto/admin-dict.dto';
import { CustomApiResponse } from 'src/common/decorators/api-response.decorator';
import { createPageQueryResClass } from 'src/common/dto/page-query.dto';
import { CreateAdminDictTypeDto } from './dto/create-admin-dict-type.dto';
import { UpdateAdminDictTypeDto } from './dto/update-admin-dict-type.dto';
import { QueryAdminDictTypeDto } from './dto/query-admin-dict-type.dto';
import { AdminDictTypeDto } from './dto/admin-dict-type.dto';

@ApiTags('admin端-字典管理')
@Controller('admin/dict')
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

    @Get('type/:type')
    @ApiOperation({ summary: '获取单个字典类型' })
    @CustomApiResponse({
        type: AdminDictTypeDto,
        description: "返回指定的字典类型信息",
    })
    findOneType(@Param('type') type: string) {
        return this.adminDictService.findOneType(type);
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

    @Get()
    @ApiOperation({ summary: '查询字典列表' })
    @CustomApiResponse({
        type: createPageQueryResClass(AdminDictDto),
        description: "返回字典列表",
    })
    findAll(@Query() query: QueryAdminDictDto) {
        return this.adminDictService.findAll(query);
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

    @Get(':type/:code')
    @ApiOperation({ summary: '获取单个字典项' })
    @CustomApiResponse({
        type: AdminDictDto,
        description: "返回指定的字典项信息",
    })
    findOne(@Param('type') type: string, @Param('code') code: string) {
        return this.adminDictService.findOne(type, code);
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
