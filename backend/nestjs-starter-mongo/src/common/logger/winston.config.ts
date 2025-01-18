import * as winston from 'winston';
import 'winston-daily-rotate-file';
import LokiTransport from 'winston-loki';
import configuration from '../../config/configuration';

const { combine, timestamp, printf } = winston.format;

const enableLoki = configuration().loki.enabled;

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

export const winstonConfig = {
	levels:customLevels,
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
					return (info.level === 'request'||info.level === 'error') ? false : info;
				})(),
				timestamp(),
				customFormat,
			),
		}),
		// Loki 日志传输
		enableLoki ? new LokiTransport({
			host: 'http://localhost:3100',
			labels: { app: 'nestjs-starter' },
			format: combine(
			  timestamp(), // 自动生成 ISO 格式时间戳
			  winston.format.json() // JSON 格式化输出
			),
			onConnectionError: (err) => {
			  console.error('Loki connection error:', err);
			},
		}) : null,
	].filter(Boolean), // 过滤掉 null 的传输
};
