import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateAdminRoleDto {
  @ApiProperty({ description: '角色名称' ,example: '测试人员' })
  @IsString()
  name: string;

  @ApiProperty({ description: '角色描述' ,example: '提供查看管理员用户列表和更新管理与用户权限' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '权限列表' ,example: ['admin-users.findAll','admin-users.update'] })
  @IsArray()
  @IsOptional()
  permissions?: string[];
}

