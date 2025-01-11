import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, Logger } from 'winston';
import { winstonConfig } from './winston.config';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger(winstonConfig);
  }

  log(message: string, metadata?: any) {
    this.logger.info(message, metadata);
  }

  error(message: string, trace?: string, metadata?: any) {
    this.logger.error(message, { ...metadata, trace });
  }

  warn(message: string, metadata?: any) {
    this.logger.warn(message, metadata);
  }

  debug(message: string, metadata?: any) {
    this.logger.debug(message, metadata);
  }

  verbose(message: string, metadata?: any) {
    this.logger.verbose(message, metadata);
  }
  request(message: string, metadata?: any) {
    this.logger.log("request",message, metadata);
  }
}
