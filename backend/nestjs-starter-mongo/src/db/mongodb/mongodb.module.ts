import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AdminRoleSchema } from 'src/endpoints/admin/admin-roles/entities/admin-role.entity';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                const dbConfig = configService.get('mongodb');
				let connectionString =`mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?authSource=admin`
				if(dbConfig.replicaSet){
					connectionString = `${connectionString}&replicaSet=${dbConfig.replicaSet}`
				}
				return {
                    uri: connectionString
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([AdminRoleSchema]),
    ],
})
export class MongodbModule { }
