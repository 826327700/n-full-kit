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
