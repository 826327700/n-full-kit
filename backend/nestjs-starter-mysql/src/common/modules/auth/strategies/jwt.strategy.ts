import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**当前JWT策略列表 */
export const JwtStrategys={
	app:{
		name:'app-jwt',
		secretOrKeyPath:'jwt.app.secret',
		expiresInPath:'jwt.app.expiresIn',
	},
	admin:{
		name:'admin-jwt',
		secretOrKeyPath:'jwt.admin.secret',
		expiresInPath:'jwt.admin.expiresIn',
	}
}

@Injectable()
export class AppJwtStrategy extends PassportStrategy(Strategy, JwtStrategys.app.name) {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get(JwtStrategys.app.secretOrKeyPath),
		});
	}

	async validate(payload: any) {
		if (!payload) {
			throw new UnauthorizedException('Invalid token payload');
		}
		return payload;
	}
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, JwtStrategys.admin.name) {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get(JwtStrategys.admin.secretOrKeyPath),
		});
	}

	async validate(payload: any) {
		if (!payload) {
			throw new UnauthorizedException('Invalid token payload');
		}
		return payload;
	}
}
