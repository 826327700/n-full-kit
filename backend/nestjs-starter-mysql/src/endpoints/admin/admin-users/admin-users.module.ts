import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { AdminUser } from './entities/admin-user.entity';
import { AuthModule } from 'src/common/modules/auth/auth.module';
import { AdminRole } from '../admin-roles/entities/admin-role.entity';
import { AdminPermission } from '../admin-roles/entities/admin-permission.entity';
import { AdminMenu } from '../admin-roles/entities/admin-menu.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser, AdminRole, AdminPermission,AdminMenu]),
    AuthModule
  ],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService,TypeOrmModule.forFeature([AdminUser])]
})
export class AdminUsersModule { }
