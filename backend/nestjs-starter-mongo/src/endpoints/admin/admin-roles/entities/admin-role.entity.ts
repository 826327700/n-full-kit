import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminRoleDocument = HydratedDocument<AdminRole>;

@Schema({
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    collection: 'admin_roles' // 指定集合名称
})

export class AdminRole {
	@Prop({ type: String,required: true, unique: true, maxlength: 100 ,comment: '角色名' })
	name: string;

    @Prop({ type: String,required: false, default: "" , comment: '角色描述' })
	description: string;

	@Prop({ type: [String], default: [] ,comment: '角色菜单'})
	menus: string[];

	@Prop({ type: [String], default: [] ,comment: '角色权限'})
	permissions: string[];

	@Prop({ type: String, default: "0" ,comment: '角色状态'})
	status:string;
}

export const AdminRoleSchema = {
    name:AdminRole.name,
    schema:SchemaFactory.createForClass(AdminRole)
};
AdminRoleSchema.schema.set('toJSON', {
    virtuals: true, // 允许虚拟字段
    transform: (doc, ret) => {
      ret.id = ret._id; // 将 _id 映射到 id 为了前端兼容MySQL和MongoDB两种格式
      delete ret._id;   // 删除 _id
      delete ret.__v;   // 删除 __v（可选）
    },
});
