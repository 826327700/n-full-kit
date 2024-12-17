import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    collection: 'users' // 指定集合名称
})
export class User {
    @ApiProperty({ description: '用户名' })
    @Prop({ required: true, unique: true, maxlength: 100 })
    username: string;

    @Exclude()
    @Prop({ required: true })
    password: string;

    @ApiProperty({ description: '用户角色' })
    @Prop({ default: 'user' })
    role: string;

    @ApiProperty({ description: '创建时间' })
    createdAt?: Date;

    @ApiProperty({ description: '更新时间' })
    updatedAt?: Date;
}

export const UserSchema = {
    name:User.name,
    schema:SchemaFactory.createForClass(User)
};