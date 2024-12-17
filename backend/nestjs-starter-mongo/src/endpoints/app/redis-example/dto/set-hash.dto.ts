import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetHashDto {
    @ApiProperty({ description: '键' })
    @IsNotEmpty({ message: '键不能为空' })
    @IsString({ message: '键必须是字符串' })
    key: string;

    @ApiProperty({ description: '字段' })
    @IsNotEmpty({ message: '字段不能为空' })
    @IsString({ message: '字段必须是字符串' })
    field: string;

    @ApiProperty({ description: '值' })
    @IsNotEmpty({ message: '值不能为空' })
    @IsString({ message: '值必须是字符串' })
    value: string;
}
