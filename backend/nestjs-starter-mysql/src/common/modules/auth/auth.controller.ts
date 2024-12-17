import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('token')
  @ApiOperation({ summary: '生成JWT令牌' })
  @ApiResponse({
    status: 201,
    description: '成功生成令牌',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT令牌',
        },
      },
    },
  })
  generateToken(@Body() payload: TokenPayloadDto) {
    return this.authService.generateToken(payload);
  }
}
