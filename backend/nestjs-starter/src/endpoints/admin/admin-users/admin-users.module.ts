import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { AdminUserSchema } from './entities/admin-user.entity';
import { AuthModule } from 'src/common/modules/auth/auth.module';
import { AdminRoleSchema } from './entities/admin-role.entity';
import { AdminPermissionSchema } from './entities/admin-permission.entity';

@Module({
  imports: [
    MongooseModule.forFeature([AdminUserSchema, AdminRoleSchema, AdminPermissionSchema]),
    AuthModule
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService]
})
export class AdminUsersModule { }
