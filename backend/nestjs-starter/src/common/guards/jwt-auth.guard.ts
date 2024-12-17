import { ExecutionContext, Injectable, UnauthorizedException, Provider, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { NO_AUTH_KEY } from '../decorators/auth.decorator';

export const createJwtAuthGuard = (strategyName:string):Type<IAuthGuard> => {
    @Injectable()
    class JwtAuthGuard extends AuthGuard(strategyName) {
        constructor(private reflector: Reflector) {
            super();
        }

        canActivate(context: ExecutionContext) {
            const handler = context.getHandler();
            const controller = context.getClass();

            // 首先检查是否使用了 @NoAuth 装饰器
            const isPublic = this.reflector.getAllAndOverride<boolean>(NO_AUTH_KEY, [
                handler,
                controller,
            ]);

            // 如果使用了 @NoAuth 装饰器，则不需要认证
            if (isPublic) {
                return true;
            }

            // 执行 JWT 验证
            return super.canActivate(context);
        }

        handleRequest(err: any, user: any, info: any) {
            if (err || !user) {
                throw err || new UnauthorizedException('认证失败');
            }
            return user;
        }
    }

    return JwtAuthGuard;
};
