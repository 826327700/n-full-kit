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

    @ApiProperty({ description: '角色权限列表' ,type: [String] ,required: false })
    @IsOptional()
    @IsArray()
    permissions?: string[];
}
