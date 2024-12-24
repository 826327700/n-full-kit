import { applyDecorators, CanActivate, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { createJwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtStrategys } from '../modules/auth/strategies/jwt.strategy';
import { RolesGuard } from '../guards/roles.guard';

export const NO_AUTH_KEY = 'noAuth';

/**不需要认证 */
export const NoAuth = () => SetMetadata(NO_AUTH_KEY, true);

/**
 * 使用JWT认证
 * @param strategyName 认证策略名称
 * @param checkRoles 是否检查角色权限
 */
export const Auth = (strategyName:string = 'app',checkRoles:boolean=false) => {

	const JwtGuard=createJwtAuthGuard(strategyName);
    const guards:(CanActivate | Function)[]=[JwtGuard]
    if(checkRoles){
        guards.push(RolesGuard)
    }
    return applyDecorators(
        UseGuards(...guards),
        ApiBearerAuth('JWT-auth'),
        ApiUnauthorizedResponse({ description: '未授权' })
    );
};
