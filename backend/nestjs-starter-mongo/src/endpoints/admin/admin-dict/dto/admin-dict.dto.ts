import { ApiProperty } from '@nestjs/swagger';

export class AdminDictDto {
    @ApiProperty({ description: '字典类型标识符' })
    type: string;

    @ApiProperty({ description: '字典类型显示名称' })
    typeName: string;

    @ApiProperty({ description: '字典编码' })
    code: string;

    @ApiProperty({ description: '显示标签' })
    label: string;

    @ApiProperty({ description: '排序号' })
    sort: number;

    @ApiProperty({ description: '状态：0-启用，1-禁用' })
    status: string;

    @ApiProperty({ description: '备注说明' })
    remark: string;

    @ApiProperty({ description: '创建时间' })
    createdAt: Date;

    @ApiProperty({ description: '更新时间' })
    updatedAt: Date;
}
