import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    // @ApiProperty({
    //     description: '用户名',
    //     example: 'johndoe',
    //     minLength: 4,
    //     maxLength: 20,
    //     type: String,
    //     required: false,
    // })
    // @IsOptional()
    // @IsString({ message: '用户名必须是字符串' })
    // @Length(4, 20, { message: '用户名长度必须在4-20个字符之间' })
    // @Matches(/^[a-zA-Z0-9_-]+$/, { 
    //     message: '用户名只能包含字母、数字、下划线和连字符' 
    // })
    // username?: string;

    // @ApiProperty({
    //     description: '密码',
    //     example: 'Password123',
    //     minLength: 6,
    //     maxLength: 20,
    //     type: String,
    //     required: false,
    //     format: 'password'
    // })
    // @IsOptional()
    // @IsString({ message: '密码必须是字符串' })
    // @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
    // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,20}$/, {
    //     message: '密码必须包含至少一个大写字母、一个小写字母和一个数字'
    // })
    // password?: string;
}
