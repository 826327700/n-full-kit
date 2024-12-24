import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDictDocument = HydratedDocument<AdminDict>;

@Schema({
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    collection: 'admin_dicts' // 指定集合名称
})
export class AdminDict {
    @Prop({ type: String, required: true, maxlength: 100, comment: '字典类型标识符' })
    type: string;

    @Prop({ type: String, required: true, maxlength: 100, comment: '字典编码' })
    code: string;

    @Prop({ type: String, required: true, maxlength: 100, comment: '显示标签' })
    label: string;

    @Prop({ type: Number, required: true, default: 0, comment: '排序号' })
    sort: number;

    @Prop({ type: String, default: "0", comment: '状态：0-启用，1-禁用' })
    status: string;

    @Prop({ type: String, required: false, maxlength: 500, comment: '备注说明' })
    remark: string;
}

export const AdminDictSchema = {
    name: AdminDict.name,
    schema: SchemaFactory.createForClass(AdminDict)
};

// 添加复合唯一索引
AdminDictSchema.schema.index({ type: 1, code: 1 }, { unique: true });
// 添加排序索引
AdminDictSchema.schema.index({ type: 1, sort: 1 });
// 添加type单独索引，优化按type查询性能
AdminDictSchema.schema.index({ type: 1 });

AdminDictSchema.schema.set('toJSON', {
    virtuals: true, // 允许虚拟字段
    transform: (doc, ret) => {
      ret.id = ret._id; // 将 _id 映射到 id 为了前端兼容MySQL和MongoDB两种格式
      delete ret._id;   // 删除 _id
      delete ret.__v;   // 删除 __v（可选）
    },
});
