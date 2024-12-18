import { Module } from '@nestjs/common';
import { PermissionCollectService } from './permission-collect.service';
import { DiscoveryService } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminPermissionSchema } from 'src/endpoints/admin/admin-roles/entities/admin-permission.entity';

/**权限信息收集 */
@Module({
  imports: [
    MongooseModule.forFeature([AdminPermissionSchema]),
  ],
  providers: [PermissionCollectService,DiscoveryService]
})
export class PermissionCollectModule {}
