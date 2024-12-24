import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDictTypeDto {
    @ApiProperty({ description: '字典类型标识符' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    type: string;

    @ApiProperty({ description: '字典类型显示名称' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    typeName: string;

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
