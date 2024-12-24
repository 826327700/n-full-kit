import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminPermissionDocument = HydratedDocument<AdminPermission>;

@Schema({
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    collection: 'admin_permissions' // 指定集合名称
})

export class AdminPermission {
	@Prop({ type: String,required: true, unique: true, maxlength: 100 ,comment: '权限名' })
	key: string;

    @Prop({ type: String,required: true, comment: '权限描述' })
	description: string;

	@Prop({ type: String,required: true ,comment: '所属分组key'})
	group:string;

	@Prop({ type: String,required: true ,comment: '所属分组描述'})
	groupDescription:string;

	@Prop({ type: String, default: "0" ,comment: '权限状态'})
	status:string;
}

export const AdminPermissionSchema = {
    name:AdminPermission.name,
    schema:SchemaFactory.createForClass(AdminPermission)
};
AdminPermissionSchema.schema.set('toJSON', {
    virtuals: true, // 允许虚拟字段
    transform: (doc, ret) => {
      ret.id = ret._id; // 将 _id 映射到 id 为了前端兼容MySQL和MongoDB两种格式
      delete ret._id;   // 删除 _id
      delete ret.__v;   // 删除 __v（可选）
    },
});
