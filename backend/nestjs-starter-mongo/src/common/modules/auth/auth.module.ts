import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AdminJwtStrategy, AppJwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    PassportModule,
	  JwtModule.register({})
  ],
  providers: [
    AuthService,
    AppJwtStrategy,
	  AdminJwtStrategy
  ],
  exports: [AuthService],
})
export class AuthModule { }
