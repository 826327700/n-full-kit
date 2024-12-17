import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('admin_roles')
export class AdminRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        type: 'varchar', 
        length: 100, 
        unique: true, 
        nullable: false,
        comment: '角色名'
    })
    name: string;

    @Column({ 
        type: 'varchar', 
        nullable: false,
        comment: '角色描述'
    })
    description: string;

    @Column({ 
        type: 'text',
        transformer: {
            to: (value: string[]) => JSON.stringify(value),
            from: (value: string) => JSON.parse(value || '[]')
        },
        comment: '角色权限'
    })
    permissions: string[];

    @Column({ 
        type: 'varchar',
        default: '0',
        comment: '角色状态'
    })
    status: string;

    @CreateDateColumn({
        comment: '创建时间'
    })
    createdAt: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updatedAt: Date;
}
