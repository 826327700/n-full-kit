import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDictTypeDocument = HydratedDocument<AdminDictType>;

@Schema({
    timestamps: true,
    collection: 'admin_dict_types'
})
export class AdminDictType {
    @Prop({ type: String, required: true, unique: true, maxlength: 100, comment: '字典类型标识符' })
    type: string;

    @Prop({ type: String, required: true, maxlength: 100, comment: '字典类型显示名称' })
    typeName: string;

    @Prop({ type: String, default: "0", comment: '状态：0-启用，1-禁用' })
    status: string;

    @Prop({ type: String, required: false, maxlength: 500, comment: '备注说明' })
    remark: string;
}

export const AdminDictTypeSchema = {
    name: AdminDictType.name,
    schema: SchemaFactory.createForClass(AdminDictType)
};
