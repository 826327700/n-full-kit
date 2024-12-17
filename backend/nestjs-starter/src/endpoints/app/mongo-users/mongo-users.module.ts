import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoUsersService } from './mongo-users.service';
import { MongoUsersController } from './mongo-users.controller';
import { UserSchema } from './entities/user.schema';
import { AuthModule } from '../../../common/modules/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([UserSchema]),
        AuthModule,
    ],
    controllers: [MongoUsersController],
    providers: [MongoUsersService],
})
export class MongoUsersModule { }
