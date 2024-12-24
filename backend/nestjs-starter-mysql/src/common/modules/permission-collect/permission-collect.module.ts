import { Module } from '@nestjs/common';
import { PermissionCollectService } from './permission-collect.service';
import { DiscoveryService } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminPermission } from 'src/endpoints/admin/admin-roles/entities/admin-permission.entity';

/**权限信息收集 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AdminPermission]),
  ],
  providers: [PermissionCollectService,DiscoveryService]
})
export class PermissionCollectModule {}
