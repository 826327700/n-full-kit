import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Auth, NoAuth } from '../../../common/decorators/auth.decorator';
import { CustomApiResponse } from '../../../common/decorators/api-response.decorator';
import { PageQueryDto } from '../../../common/dto/page-query.dto';
import { User } from './entities/user.schema';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('app端-增删改查示例(MongoDB版)')
@ApiBearerAuth('JWT-auth')
@Controller('app/users')
@Auth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @NoAuth()
    @ApiOperation({ summary: '创建用户' })
    @CustomApiResponse({
        type: User,
        description: '创建的用户'
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
	@NoAuth()
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
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: '根据ID更新用户' })
    @ApiParam({ name: 'id', description: '用户ID' })
    @CustomApiResponse({
        type: User,
        description: '更新的用户'
    })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: '根据ID删除用户' })
    @ApiParam({ name: 'id', description: '用户ID' })
    @CustomApiResponse({
        type: Boolean,
        description: '删除成功'
    })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
