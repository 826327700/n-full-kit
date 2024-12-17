import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { createJwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtStrategys } from '../modules/auth/strategies/jwt.strategy';

export const NO_AUTH_KEY = 'noAuth';

/**不需要认证 */
export const NoAuth = () => SetMetadata(NO_AUTH_KEY, true);

/**使用JWT认证 */
export const Auth = (strategyName:keyof typeof JwtStrategys = 'app') => {
	let innerName=JwtStrategys[strategyName]?.name
	if(!innerName){
		return applyDecorators()
	}
	const guard=createJwtAuthGuard(innerName);
    return applyDecorators(
        UseGuards(guard),
        ApiBearerAuth('JWT-auth'),
        ApiUnauthorizedResponse({ description: '未授权' })
    );
};
