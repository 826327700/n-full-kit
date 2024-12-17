import { Module } from '@nestjs/common';
import { MysqlModule } from './mysql/mysql.module';
import { MongodbModule } from './mongodb/mongodb.module';

@Module({
    imports:[
        MysqlModule,
        MongodbModule
    ]
})
export class DatabaseModule {}
