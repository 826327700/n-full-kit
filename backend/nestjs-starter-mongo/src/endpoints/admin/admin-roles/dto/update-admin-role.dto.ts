import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAdminRoleDto {
    @ApiProperty({ description: '角色名称' ,required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: '角色描述' ,required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: '角色菜单列表' ,type: [String] ,required: true })
    @IsNotEmpty()
    @IsArray()
    menus: string[];

	@ApiProperty({ description: '角色权限列表' ,type: [String] ,required: true })
    @IsNotEmpty()
    @IsArray()
    permissions: string[];

	@ApiProperty({ description: '角色状态' ,required: false })
	@IsOptional()
	@IsString()
	status?: string='0';
}
