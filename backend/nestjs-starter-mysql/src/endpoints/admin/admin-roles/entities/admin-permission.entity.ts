import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admin_permissions' })
export class AdminPermission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 100, unique: true, comment: '权限名' })
	key: string;

	@Column({ type: 'varchar', comment: '权限描述' })
	description: string;

	@Column({ type: 'varchar', comment: '所属分组key' })
	group: string;

	@Column({ type: 'varchar', comment: '所属分组描述' })
	groupDescription: string;

	@Column({ type: 'varchar', default: '0', comment: '权限状态' })
	status: string;
}
