import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admin_menus' })
export class AdminMenu {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 100, comment: '菜单路径' })
	path: string;

	@Column({ type: 'varchar', unique: true, comment: '菜单key' })
	name: string;

	@Column({ type: 'varchar', comment: '菜单描述' })
	title: string;

	@Column({ 
        type: 'text', 
            transformer: {
            to: (value: string[]) => JSON.stringify(value),
            from: (value: string) => JSON.parse(value || '[]')
        }, 
        comment: '菜单关联权限' 
    })
    permissions: string[];

	@Column({ type: 'varchar', default: '', comment: '父级菜单名' })
	parentName: string;

	@Column({ type: 'varchar', default: '0', comment: '菜单状态' })
	status: string;
}
