import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageQueryDto } from 'src/common/dto/page-query.dto';

export class QueryAdminDictTypeDto extends PageQueryDto {

    @ApiProperty({ description: '搜索关键词', required: false })
    @IsString()
    @IsOptional()
    keyword?: string;

    @ApiProperty({ description: '状态：0-启用，1-禁用', required: false })
    @IsString()
    @IsOptional()
    status?: string;
}
