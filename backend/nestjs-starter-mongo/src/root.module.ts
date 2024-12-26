import { Module } from '@nestjs/common';
import { EndpointsModule } from './endpoints/endpoints.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './common/modules/auth/auth.module';
import { LoggerModule } from './common/logger/logger.module';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { RedisClientModule } from './common/modules/redis/redis.module';
import { DatabaseModule } from './db/database.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigService } from '@nestjs/config';
import { CustomCacheInterceptor } from './common/interceptors/custom-cache.interceptor';
import { PermissionCollectModule } from './common/modules/permission-collect/permission-collect.module';
import { ConsulModule } from './common/modules/consul/consul.module';
import { ConsulService } from './common/modules/consul/consul.service';


@Module({
	imports: [
		/**配置管理模块 */
		ConfigModule,
		/**认证模块 */
		AuthModule,
		/**日志模块 */
		LoggerModule,
		/**数据库模块 */
		DatabaseModule,
		/**缓存模块 */
		CacheModule.registerAsync({
			isGlobal: true,
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const store = await redisStore({
					password: configService.get('REDIS_PASSWORD', ''),
					socket: {
						host: configService.get('REDIS_HOST', 'localhost'),
						port: configService.get('REDIS_PORT', 6379),
						passphrase: configService.get('REDIS_PASSWORD', ''),
					},
				});

				return {
					store: store as unknown as CacheStore,
					ttl: 3 * 60000, // 3 minutes (milliseconds)
				};
			},
		}),
		ConsulModule.forRoot({
			host: '192.168.31.32',
			port: 8500,
			defaults: {
				token: 'admin', // 如果需要的话
			},
		}),
		/**Redis客户端模块 */
		RedisClientModule,
		/**权限信息收集模块 */
		PermissionCollectModule,
		/**端点模块 */
		EndpointsModule,
	],
	providers: [
		// 注册 RequestLoggingInterceptor 作为提供者
		{
			provide: APP_INTERCEPTOR,
			useClass: RequestLoggingInterceptor,
		},
		// 注册 HttpExceptionFilter 作为提供者
		HttpExceptionFilter,
		// 注册全局异常过滤器
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		// 注册 CustomCacheInterceptor 作为提供者
		{
			provide: APP_INTERCEPTOR,
			useClass: CustomCacheInterceptor,
		},
	],
})
export class RootModule {
	constructor(private readonly consulService: ConsulService) { }

	async onModuleInit() {
		console.log('RootModule onModuleInit');
		this.consulService.register({
			name: 'server-nest',
			address: 'host.docker.internal',//这里没有填写具体的ip
			port: 3000,
			tags: [
				"traefik.enable=true",
				"traefik.http.routers.nest-service.rule=Host(`nest.localhost`) && PathPrefix(`/nest-service`)",
				"traefik.http.routers.nest-service.entrypoints=web",
				// // 定义路径前缀中间件
				"traefik.http.middlewares.strip-test-prefixes.stripprefix.prefixes=/nest-service",
				"traefik.http.routers.nest-service.middlewares=strip-test-prefixes@consulcatalog",
				// 服务配置
				"traefik.http.services.nest-service.loadbalancer.server.scheme=http",
				`traefik.http.services.nest-service.loadbalancer.server.port=3000`,
				"traefik.http.services.nest-service.loadbalancer.passhostheader=true",
			],
			check: {
				http: 'http://192.168.31.32:3000/rate-limit/no-limit',
				interval: '5s',
				timeout: '5s',
				deregistercriticalserviceafter: '30s',
			},
		});
	}
}
