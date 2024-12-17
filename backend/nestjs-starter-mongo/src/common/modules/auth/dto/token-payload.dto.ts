import { IsString, IsArray, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadDto {
  @ApiProperty({
    description: '用户ID',
    example: '123',
  })
  userId: string|number;

  @ApiProperty({
    description: '用户角色列表',
    example: ['admin', 'user'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  roles?: string[];

  @ApiProperty({
    description: '自定义数据',
    example: { department: 'IT' },
    required: false,
    type: Object,
  })
  @IsObject()
  @IsOptional()
  customData?: Record<string, any>
}
