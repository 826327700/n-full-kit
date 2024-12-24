import { ApiProperty } from '@nestjs/swagger';

export class AdminDictTypeDto {
    @ApiProperty({ description: '字典类型id' })
    id: string;

    @ApiProperty({ description: '字典类型标识符' })
    type: string;

    @ApiProperty({ description: '字典类型显示名称' })
    typeName: string;

    @ApiProperty({ description: '状态：0-启用，1-禁用' })
    status: string;

    @ApiProperty({ description: '备注说明' })
    remark: string;

    @ApiProperty({ description: '来源，custom-手动添加，system-代码内置 ' })
    from: string;

    @ApiProperty({ description: '创建时间' })
    createdAt: Date;

    @ApiProperty({ description: '更新时间' })
    updatedAt: Date;
}
