import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAdminUserDto {
    @ApiProperty({ description: '用户名', example: 'root' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: '密码', example: 'root123' })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UserInfo {
	@ApiProperty({ description: '用户id' })
	id: string
	@ApiProperty({ description: '用户昵称' })
	nickname: string
	@ApiProperty({ description: '用户菜单name' ,type: [String]})
	menus: string[]
	@ApiProperty({ description: '用户权限key' ,type: [String]})
	permissions: string[]
}
export class LoginAdminUserResDto {
	@ApiProperty({ description: 'token' })
	access_token: string

	@ApiProperty({ description: '用户信息' ,type: UserInfo})
	user: UserInfo
}
