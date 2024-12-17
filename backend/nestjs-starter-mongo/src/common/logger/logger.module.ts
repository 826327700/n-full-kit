import { Module, Global } from '@nestjs/common';
import { WinstonLoggerService } from './winston.service';

@Global()
@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class LoggerModule {}
