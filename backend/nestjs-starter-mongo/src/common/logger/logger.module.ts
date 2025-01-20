import { Module, Global } from '@nestjs/common';
import { WinstonLoggerService } from './winston.service';
import { WinstonConfig } from './winston.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [WinstonLoggerService, WinstonConfig],
  exports: [WinstonLoggerService],
})
export class LoggerModule {}
