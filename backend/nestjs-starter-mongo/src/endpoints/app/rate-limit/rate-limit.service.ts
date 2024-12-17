import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitService {
  getDefaultLimit(): string {
    return '这是默认的限流配置（每分钟10次请求）';
  }

  getStrictLimit(): string {
    return '这是更严格的限流配置（每分钟3次请求）';
  }

  getNoLimit(): string {
    return '这个接口没有限流';
  }
}
