import { Module } from '@nestjs/common';
import { AdminDictService } from './admin-dict.service';
import { AdminDictController } from './admin-dict.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDict } from './entities/admin-dict.entity';
import { AdminDictType } from './entities/admin-dict-type.entity';

@Module({
    imports: [
       TypeOrmModule.forFeature([AdminDict, AdminDictType]),
    ],
    controllers: [AdminDictController],
    providers: [AdminDictService],
    exports: [AdminDictService],
})
export class AdminDictModule {}
