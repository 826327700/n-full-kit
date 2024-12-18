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
	@ApiProperty({ description: '用户名' })
	username: string
	@ApiProperty({ description: '用户角色' })
	roles: string[]
}
export class LoginAdminUserResDto {
	/**
	 * {
			access_token,
			user: {
				id: user._id,
				username: user.username,
				roles: user.roles
			}
		}
	 */
	@ApiProperty({ description: 'token' })
	access_token: string

	@ApiProperty({ description: '用户信息' ,type: UserInfo})
	user: UserInfo
}
