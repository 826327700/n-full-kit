import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MongoUsersService } from './mongo-users.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Auth, NoAuth } from '../../../common/decorators/auth.decorator';
import { CustomApiResponse, CustomApiResponseList } from '../../../common/decorators/api-response.decorator';
import { createPageQueryResClass, PageQueryDto } from '../../../common/dto/page-query.dto';
import { User } from './entities/user.schema';
import { LoginDto } from '../users/dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@ApiTags('app端-增删改查示例(MongoDB版)')
@ApiBearerAuth('JWT-auth')
@Controller('app/mongo-users')
@Auth()
export class MongoUsersController {
    constructor(private readonly mongoUsersService: MongoUsersService) { }

    @Post()
    @NoAuth()
    @ApiOperation({ summary: '创建用户' })
    @CustomApiResponse(User)
    create(@Body() createUserDto: CreateUserDto) {
        return this.mongoUsersService.create(createUserDto);
    }

    @Post('login')
    @NoAuth()
    @ApiOperation({ summary: '用户登录' })
    @CustomApiResponse(User)
    login(@Body() loginDto: LoginDto) {
        return this.mongoUsersService.login(loginDto);
    }

    @Get()
    @ApiOperation({ summary: '分页获取用户列表' })
    @CustomApiResponse(createPageQueryResClass(User))
    findAll(@Query() pageQueryDto: PageQueryDto) {
        return this.mongoUsersService.findAll(pageQueryDto);
    }

    @Get(':id')
    @ApiOperation({ summary: '根据ID获取用户' })
    @ApiParam({ name: 'id', description: '用户ID' })
    @CustomApiResponse(User)
    findOne(@Param('id') id: string) {
        return this.mongoUsersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: '根据ID更新用户' })
    @ApiParam({ name: 'id', description: '用户ID' })
    @CustomApiResponse(User)
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.mongoUsersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '根据ID删除用户' })
    @ApiParam({ name: 'id', description: '用户ID' })
    @CustomApiResponse(User)
    remove(@Param('id') id: string) {
        return this.mongoUsersService.remove(id);
    }
}
