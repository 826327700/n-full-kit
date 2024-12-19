import { Module } from '@nestjs/common';
import { AdminRolesService } from './admin-roles.service';
import { AdminRolesController } from './admin-roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminRoleSchema } from './entities/admin-role.entity';
import { AdminPermissionSchema } from './entities/admin-permission.entity';
import { AdminMenuSchema } from './entities/admin-menu.entity';

@Module({
	imports: [
		MongooseModule.forFeature([AdminRoleSchema,AdminPermissionSchema,AdminMenuSchema]),
	],
	controllers: [AdminRolesController],
	providers: [AdminRolesService],
})
export class AdminRolesModule { }
