import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PageQueryDto } from "src/common/dto/page-query.dto";

export class QueryAdminUserDto extends PageQueryDto {
	@ApiProperty({ description: '搜索关键词',required: false })
	@IsString()
	@IsOptional()
	keyword?: string
}

export class AdminUserRoleItem{

	@ApiProperty({ description: '角色名称' })
	name: string;

	@ApiProperty({ description: '角色描述' })
	description: string;
}

export class AdminUserDto{
    @ApiProperty({ description: '用户ID' })
    _id: string;

    @ApiProperty({ description: '用户名' })
    username: string;

    @ApiProperty({ description: '所属角色', type: [AdminUserRoleItem] })
    roles: AdminUserRoleItem[];

    @ApiProperty({ description: '状态', example: '0' })
    status: string;

	@ApiProperty({ description: '创建时间' })
    createdAt: Date;

    @ApiProperty({ description: '更新时间' })
    updatedAt: Date;
}
