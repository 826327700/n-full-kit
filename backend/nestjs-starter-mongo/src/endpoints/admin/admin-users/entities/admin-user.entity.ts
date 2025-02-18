import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Exclude } from 'class-transformer';

export type AdminUserDocument = HydratedDocument<AdminUser>;

@Schema({
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    collection: 'admin_users' // 指定集合名称
})

export class AdminUser {
	@Prop({ type: String,required: true, maxlength: 100 ,comment: '用户昵称' })
	nickname: string;

	@Prop({ type: String,required: true, unique: true, maxlength: 100 ,comment: '用户名' })
	username: string;

	@Exclude()
    @Prop({ type: String,required: true, comment: '密码' })
	password: string;

	@Prop({ type: [String], default: [] ,comment: '用户角色'})
	roles: string[];

	@Prop({ type: String, default: "0" ,comment: '用户状态'})
	status:string;
}

export const AdminUserSchema = {
    name:AdminUser.name,
    schema:SchemaFactory.createForClass(AdminUser)
};

AdminUserSchema.schema.set('toJSON', {
    virtuals: true, // 允许虚拟字段
    transform: (doc, ret) => {
      ret.id = ret._id; // 将 _id 映射到 id 为了前端兼容MySQL和MongoDB两种格式
      delete ret._id;   // 删除 _id
      delete ret.__v;   // 删除 __v（可选）
    },
});
