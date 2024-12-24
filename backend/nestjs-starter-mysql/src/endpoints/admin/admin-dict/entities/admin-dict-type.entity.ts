import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admin_dict_types' })
export class AdminDictType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true, comment: '字典类型标识符' })
    type: string;

    @Column({ type: 'varchar', length: 100, comment: '字典类型显示名称' })
    typeName: string;

    @Column({ type: 'varchar', default: '0', comment: '状态：0-启用，1-禁用' })
    status: string;

    @Column({ type: 'varchar', length: 500, nullable: true, comment: '备注说明' })
    remark: string;

    @Column({ type: 'varchar', default: 'custom', comment: '来源，custom-手动添加，system-代码内置' })
    from: string;
}