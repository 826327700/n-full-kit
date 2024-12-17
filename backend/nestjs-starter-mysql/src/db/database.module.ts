import { Module } from '@nestjs/common';
import { MysqlModule } from './mysql/mysql.module';

@Module({
    imports:[
        MysqlModule
    ]
})
export class DatabaseModule {}
