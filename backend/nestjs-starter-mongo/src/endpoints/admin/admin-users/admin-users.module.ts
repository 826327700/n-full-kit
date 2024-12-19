import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { AdminUserSchema } from './entities/admin-user.entity';
import { AuthModule } from 'src/common/modules/auth/auth.module';
import { AdminRoleSchema } from '../admin-roles/entities/admin-role.entity';
import { AdminPermissionSchema } from '../admin-roles/entities/admin-permission.entity';
import { AdminMenuSchema } from '../admin-roles/entities/admin-menu.entity';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([AdminUserSchema, AdminRoleSchema,AdminPermissionSchema,AdminMenuSchema]),
    AuthModule
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService,MongooseModule.forFeature([AdminUserSchema])]
})
export class AdminUsersModule { }
