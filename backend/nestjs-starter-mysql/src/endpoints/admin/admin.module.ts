import { Module } from '@nestjs/common';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminRolesModule } from './admin-roles/admin-roles.module';
import { AdminDictModule } from './admin-dict/admin-dict.module';
@Module({
	imports: [
		AdminUsersModule,
		AdminRolesModule,
		AdminDictModule
	],
})
export class AdminModule { }
