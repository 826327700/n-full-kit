import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
    @ApiProperty({ description: '用户ID' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: '用户名' })
    @Column({ length: 100, unique: true })
    username: string;

    @Exclude()
    @Column()
    password: string;

    @ApiProperty({ description: '用户角色' })
    @Column({ default: 'user' })
    role: string;

    @ApiProperty({ description: '创建时间' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: '更新时间' })
    @UpdateDateColumn()
    updatedAt: Date;
}
