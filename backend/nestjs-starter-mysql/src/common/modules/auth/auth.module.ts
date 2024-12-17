import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AdminJwtStrategy, AppJwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [
    PassportModule,
	  JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AppJwtStrategy,
	  AdminJwtStrategy
  ],
  exports: [AuthService],
})
export class AuthModule { }
