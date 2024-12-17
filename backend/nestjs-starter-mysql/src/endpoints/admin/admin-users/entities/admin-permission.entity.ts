import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('admin_permissions')
export class AdminPermission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        type: 'varchar', 
        length: 100, 
        unique: true, 
        nullable: false,
        comment: '权限名'
    })
    key: string;

    @Column({ 
        type: 'varchar', 
        nullable: false,
        comment: '权限描述'
    })
    description: string;

    @Column({ 
        type: 'varchar', 
        nullable: false,
        comment: '所属分组key'
    })
    group: string;

    @Column({ 
        type: 'varchar', 
        nullable: false,
        comment: '所属分组描述'
    })
    groupDescription: string;

    @Column({ 
        type: 'varchar', 
        default: '0',
        comment: '权限状态'
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
