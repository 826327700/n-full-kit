import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class UpdateAdminUserDto {
    @ApiProperty({ description: '用户昵称', example: '小包子' })
    @IsString()
    @IsOptional()
    @Length(1, 10)
	nickname: string;

    @ApiProperty({ description: '用户名', example: 'admin' })
    @IsString()
    @IsOptional()
    @Length(1, 100)
    username?: string;

    @ApiProperty({ description: '密码',example:'admin123' })
    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty({ description: '用户绑定角色id，可绑定多个', example: [], type: [String] })
    @IsArray()
    @IsOptional()
    roles?: string[];

    @ApiProperty({ description: '用户状态', example: '0', default: '0' })
    @IsString()
    @IsOptional()
    status?: string;
}
