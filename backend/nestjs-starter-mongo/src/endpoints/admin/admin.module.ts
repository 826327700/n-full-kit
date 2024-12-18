import { Module } from '@nestjs/common';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminRolesModule } from './admin-roles/admin-roles.module';
@Module({
	imports: [
		AdminUsersModule,
		AdminRolesModule
	],
})
export class AdminModule { }
