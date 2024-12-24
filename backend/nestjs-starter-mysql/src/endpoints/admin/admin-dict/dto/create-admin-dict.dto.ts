import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDictDto {
    @ApiProperty({ description: '字典类型标识符' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    type: string;

    @ApiProperty({ description: '字典编码' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    code: string;

    @ApiProperty({ description: '显示标签' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    label: string;

    @ApiProperty({ description: '排序号' })
    @IsNumber()
    @IsOptional()
    sort?: number;

    @ApiProperty({ description: '状态：0-启用，1-禁用', default: '0' })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiProperty({ description: '备注说明' })
    @IsString()
    @IsOptional()
    @MaxLength(500)
    remark?: string;
}
