import * as winston from 'winston';
import 'winston-daily-rotate-file';
import LokiTransport from 'winston-loki';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

const { combine, timestamp, printf } = winston.format;

@Injectable()
export class WinstonConfig {
	constructor(private readonly configService: ConfigService) { }

	createWinstonConfig() {
		const lokiConfig = this.configService.get('loki');

		// 自定义日志格式
		const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
			// 移除 response 字段
			if (metadata && metadata.response) {
				delete metadata.response;
			}

			// 格式化元数据，使用2个空格缩进
			const metadataStr = Object.keys(metadata).length
				? '\n' + JSON.stringify(metadata, null, 2)
				: '';

			return `[${timestamp}] ${level}: ${message}${metadataStr}`;
		});
		const defaultLevels = winston.config.npm.levels;
		// 添加自定义日志级别
		const customLevels = {
			...defaultLevels, // 保留默认级别
			request: 6 // 添加自定义级别用于请求日志
		};

		return {
			levels: customLevels,
			transports: [
				// 请求日志文件
				new winston.transports.DailyRotateFile({
					filename: 'logs/request/%DATE%.log',
					datePattern: 'YYYY-MM-DD',
					zippedArchive: true,
					maxSize: '20m',
					maxFiles: '14d',
					level: 'request',
					format: combine(
						winston.format((info) => {
							return info.level === 'request' ? info : false;
						})(),
						timestamp(),
						customFormat
					),
				}),
				// 错误日志文件
				new winston.transports.DailyRotateFile({
					filename: 'logs/error/%DATE%.log',
					datePattern: 'YYYY-MM-DD',
					zippedArchive: true,
					maxSize: '20m',
					maxFiles: '14d',
					level: 'error',
					format: combine(
						timestamp(),
						customFormat,
					),
				}),
				// 其他日志文件
				new winston.transports.DailyRotateFile({
					filename: 'logs/other/%DATE%.log',
					datePattern: 'YYYY-MM-DD',
					zippedArchive: true,
					maxSize: '20m',
					maxFiles: '14d',
					level: 'silly',
					format: combine(
						winston.format((info) => {
							return (info.level === 'request' || info.level === 'error') ? false : info;
						})(),
						timestamp(),
						customFormat,
					),
				}),
				// Loki 日志传输
				lokiConfig?.enabled && lokiConfig?.host ? new LokiTransport({
					host: lokiConfig.host,
					basicAuth: lokiConfig.basicAuth,
					labels: { job: 'order-hub', environment: process.env.NODE_ENV },
					json: true,
					format: winston.format.json(),
					onConnectionError: (err) => {
						console.error('Loki connection error:', err);
					},
					timeout: 5000,
					interval: 2000,
					replaceTimestamp: true
				}) : null,
			].filter(Boolean), // 过滤掉 null 的传输
		};
	}
}
