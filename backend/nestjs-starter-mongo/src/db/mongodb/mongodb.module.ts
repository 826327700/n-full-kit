import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AdminRoleSchema } from 'src/endpoints/admin/admin-roles/entities/admin-role.entity';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                const dbConfig = configService.get('mongodb');
                return {
                    // 使用 authSource=admin 指定认证数据库
                    uri: `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?authSource=admin`,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([AdminRoleSchema]),
    ],
})
export class MongodbModule { }
