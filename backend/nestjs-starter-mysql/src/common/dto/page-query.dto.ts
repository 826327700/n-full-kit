import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PageQueryDto {
    @ApiPropertyOptional({
        description: '页码',
        default: 1,
        minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @ApiPropertyOptional({
        description: '每页数量',
        default: 10,
        minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize?: number = 10;
}

export class PageQueryRes<T> {
    @ApiProperty({ description: '数据列表', isArray: true })
    list: T[];

    @ApiProperty({ description: '总数量' })
    total: number;

    @ApiProperty({ description: '当前页码' })
    page: number;

    @ApiProperty({ description: '每页数量' })
    pageSize: number;
}

// 创建一个工具类型，用于生成特定类型的分页响应类
export function createPageQueryResClass<T>(itemType: new () => T): new () => PageQueryRes<T> {
    class PageQueryResImpl extends PageQueryRes<T> {
        @ApiProperty({ description: '数据列表', type: itemType, isArray: true })
        list: T[];
    }
    Object.defineProperty(PageQueryResImpl, 'name', { value: `PageQueryRes${itemType.name}` });
    return PageQueryResImpl;
}