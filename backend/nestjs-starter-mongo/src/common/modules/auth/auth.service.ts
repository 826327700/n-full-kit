import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategys } from './strategies/jwt.strategy';
import { JWTUser } from 'src/common/interfaces/request';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService
	) { }

	generateToken(payload: JWTUser, strategyName: keyof typeof JwtStrategys = 'app') {
		// 转换为纯对象
		const tokenPayload = {
			userId: payload.userId,
			roles: payload.roles || [],
			customData: payload.customData || {}
		};

		const secret = this.configService.get(JwtStrategys[strategyName].secretOrKeyPath);
		const expiresIn = this.configService.get(JwtStrategys[strategyName].expiresInPath);
		return {
			access_token: this.jwtService.sign(tokenPayload, {
				secret: secret,
				expiresIn: expiresIn
			})
		};
	}

	verifyAsync(token: string, strategyName: keyof typeof JwtStrategys = 'app') {
		const secret = this.configService.get(JwtStrategys[strategyName].secretOrKeyPath);
		return this.jwtService.verifyAsync(token, { secret });
	}
}
