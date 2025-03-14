import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, Length, IsNotEmpty } from 'class-validator';

export class CreateAdminUserDto {
	@ApiProperty({ description: '用户昵称', example: '小包子' })
    @IsString()
    @IsNotEmpty()
    @Length(1, 10)
	nickname: string;

    @ApiProperty({ description: '用户名', example: 'admin' })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    username: string;

    @ApiProperty({ description: '密码',example:'admin123' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ description: '用户绑定角色id，可绑定多个', example: [], type: [Number] })
    @IsArray()
    @IsOptional()
    roles?: number[];

    @ApiProperty({ description: '用户状态', example: '0', default: '0' })
    @IsString()
    @IsOptional()
    status?: string;
}

