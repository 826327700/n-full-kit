import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminDictService } from './admin-dict.service';
import { AdminDictController } from './admin-dict.controller';
import { AdminDictSchema } from './entities/admin-dict.entity';
import { AdminDictTypeSchema } from './entities/admin-dict-type.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            AdminDictSchema,
            AdminDictTypeSchema,
        ]),
    ],
    controllers: [AdminDictController],
    providers: [AdminDictService],
    exports: [AdminDictService],
})
export class AdminDictModule {}
