import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PageQueryDto } from "src/common/dto/page-query.dto";

export class QueryAdminRoleDto extends PageQueryDto {
	@ApiProperty({ description: '搜索关键词',required: false })
	@IsString()
	@IsOptional()
	keyword?: string
}

export class AdminRoleDto{
    @ApiProperty({ description: '角色ID' })
    id: string;

    @ApiProperty({ description: '角色名称' })
    name: string;

    @ApiProperty({ description: '角色描述' })
    description: string;

	@ApiProperty({ description: '角色菜单列表' ,type: [String]})
    menus: string[];

    @ApiProperty({ description: '角色权限列表' ,type: [String]})
    permissions: string[];

    @ApiProperty({ description: '状态', example: '0' })
    status: string;

	@ApiProperty({ description: '创建时间' })
    createdAt: Date;

    @ApiProperty({ description: '更新时间' })
    updatedAt: Date;
}

export class AdminPermissionItemDto {

	@ApiProperty({ type: String,description: '权限名' })
	key: string;

    @ApiProperty({ type: String,description: '权限描述' })
	description: string;

	@ApiProperty({ type: String,description: '所属分组key' })
	group:string;

	@ApiProperty({ type: String,description: '所属分组描述' })
	groupDescription:string;

	@ApiProperty({ type: String,description: '权限状态'})
	status:string;
}
