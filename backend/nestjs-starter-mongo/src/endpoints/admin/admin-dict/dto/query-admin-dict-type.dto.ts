import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageQueryDto } from 'src/common/dto/page-query.dto';

export class QueryAdminDictTypeDto extends PageQueryDto {
    @ApiProperty({ description: '字典类型标识符', required: false })
    @IsString()
    @IsOptional()
    type?: string;

    @ApiProperty({ description: '字典类型显示名称', required: false })
    @IsString()
    @IsOptional()
    typeName?: string;

    @ApiProperty({ description: '状态：0-启用，1-禁用', required: false })
    @IsString()
    @IsOptional()
    status?: string;
}
