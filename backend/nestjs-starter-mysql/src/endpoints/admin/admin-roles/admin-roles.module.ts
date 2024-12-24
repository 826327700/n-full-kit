import { Module } from '@nestjs/common';
import { AdminRolesService } from './admin-roles.service';
import { AdminRolesController } from './admin-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRole } from './entities/admin-role.entity';
import { AdminPermission } from './entities/admin-permission.entity';
import { AdminMenu } from './entities/admin-menu.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([AdminRole,AdminPermission,AdminMenu]),
	],
	controllers: [AdminRolesController],
	providers: [AdminRolesService],
})
export class AdminRolesModule { }
