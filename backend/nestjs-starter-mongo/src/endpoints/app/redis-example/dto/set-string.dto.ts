import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SetStringDto {
    @ApiProperty({ description: '键' })
    @IsNotEmpty({ message: '键不能为空' })
    @IsString({ message: '键必须是字符串' })
    key: string;

    @ApiProperty({ description: '值' })
    @IsNotEmpty({ message: '值不能为空' })
    @IsString({ message: '值必须是字符串' })
    value: string;

    @ApiPropertyOptional({ description: '过期时间（秒）' })
    @IsOptional()
    @IsNumber({}, { message: '过期时间必须是数字' })
    ttl?: number;
}
