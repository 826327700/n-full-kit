import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './entities/user.schema';
import { AuthModule } from '../../../common/modules/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([UserSchema]),
        AuthModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule { }
