import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"

export class AdminMenuItem{
	@ApiProperty({ description: '菜单路径' ,required: true })
    @IsNotEmpty()
    @IsString()
	path:string

	@ApiProperty({ description: '菜单key' ,required: true })
    @IsNotEmpty()
    @IsString()
	name:string

	@ApiProperty({ description: '菜单标题' ,required: true })
    @IsNotEmpty()
    @IsString()
	title:string

	@ApiProperty({ description: '菜单关联权限' ,required: true })
    @IsNotEmpty()
    @IsArray()
	permissions:string[]

	@ApiProperty({ description: '父级菜单key' ,required: false })
    @IsOptional()
    @IsString()
	parentName?:string
}
export class UpdateAdminMenusDto{
	@ApiProperty({ description: '菜单列表' ,type: [AdminMenuItem] ,required: true })
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({each:true})
	@Type(() => AdminMenuItem)
	menus:AdminMenuItem[]
}
