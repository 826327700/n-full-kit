import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admin_dicts' })
export class AdminDict {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, comment: '字典类型标识符' })
    type: string;

    @Column({ type: 'varchar', length: 100, comment: '字典编码' })
    code: string;

    @Column({ type: 'varchar', length: 100, comment: '显示标签' })
    label: string;

    @Column({ type: 'int', default: 0, comment: '排序号' })
    sort: number;

    @Column({ type: 'varchar', default: '0', comment: '状态：0-启用，1-禁用' })
    status: string;

    @Column({ type: 'varchar', length: 500, nullable: true, comment: '备注说明' })
    remark: string;
}