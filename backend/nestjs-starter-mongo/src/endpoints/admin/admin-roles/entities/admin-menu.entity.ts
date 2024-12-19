import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminMenuDocument = HydratedDocument<AdminMenu>;

@Schema({
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    collection: 'admin_menus' // 指定集合名称
})

export class AdminMenu {
	@Prop({ type: String,required: true, maxlength: 100 ,comment: '菜单路径' })
	path: string;

    @Prop({ type: String,required: true,  unique: true, comment: '菜单key' })
	name: string;

	@Prop({ type: String,required: true, comment: '菜单描述' })
	title: string;

	@Prop({ type: [String], default: [] ,comment: '菜单关联权限'})
	permissions: string[];

	@Prop({ type: String,required: false, default: "" , comment: '父级菜单名' })
	parentName: string;

	@Prop({ type: String, default: "0" ,comment: '菜单状态'})
	status:string;
}

export const AdminMenuSchema = {
    name:AdminMenu.name,
    schema:SchemaFactory.createForClass(AdminMenu)
};
