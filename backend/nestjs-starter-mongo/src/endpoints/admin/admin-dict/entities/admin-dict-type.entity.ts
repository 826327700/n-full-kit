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

    @Prop({ type: String, required: true, default: "custom", comment: '来源，custom-手动添加，system-代码内置' })
    from: string;
}

export const AdminDictTypeSchema = {
    name: AdminDictType.name,
    schema: SchemaFactory.createForClass(AdminDictType)
};

AdminDictTypeSchema.schema.set('toJSON', {
    virtuals: true, // 允许虚拟字段
    transform: (doc, ret) => {
      ret.id = ret._id; // 将 _id 映射到 id 为了前端兼容MySQL和MongoDB两种格式
      delete ret._id;   // 删除 _id
      delete ret.__v;   // 删除 __v（可选）
    },
});
