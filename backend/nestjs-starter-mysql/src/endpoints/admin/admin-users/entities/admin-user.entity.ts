import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('admin_users')
export class AdminUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: false,
        comment: '用户名'
    })
    username: string;

    @Exclude()
    @Column({
        type: 'varchar',
        nullable: false,
        comment: '密码'
    })
    password: string;

    @Column({
        type: 'text',
        transformer: {
            to: (value: string[]) => JSON.stringify(value),
            from: (value: string) => JSON.parse(value || '[]')
        },
        comment: '用户角色'
    })
    roles: string[];

    @Column({
        type: 'varchar',
        default: '0',
        comment: '用户状态'
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
