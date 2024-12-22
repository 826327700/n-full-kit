import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdminDictDto } from './dto/create-admin-dict.dto';
import { UpdateAdminDictDto } from './dto/update-admin-dict.dto';
import { QueryAdminDictDto } from './dto/query-admin-dict.dto';
import { AdminDict } from './entities/admin-dict.entity';
import { AdminDictType } from './entities/admin-dict-type.entity';
import { CreateAdminDictTypeDto } from './dto/create-admin-dict-type.dto';
import { UpdateAdminDictTypeDto } from './dto/update-admin-dict-type.dto';
import { QueryAdminDictTypeDto } from './dto/query-admin-dict-type.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class AdminDictService {
    constructor(
        @InjectModel(AdminDict.name)
        private adminDictModel: Model<AdminDict>,
        @InjectModel(AdminDictType.name)
        private adminDictTypeModel: Model<AdminDictType>,
    ) {
        this.importEnumDict()
    }

    async importEnumDict(){
        let enums=fs.readFileSync(path.resolve(__dirname, '../../../enum.json'), 'utf-8')
        let enumsJson=JSON.parse(enums) as Record<string,any>[]
        for (const item of enumsJson) {
            await this.adminDictTypeModel.findOneAndUpdate({
                type:item.labelKey
            },{
                $set:{
                    type:item.labelKey,
                    typeName:item.labelName,
                }
            },{
                upsert:true
            })
            await this.adminDictModel.deleteMany({type:item.labelKey})
            let optionDocs=item.options.map((option,index)=>{
                return {
                    type:item.labelKey,
                    code:option.value,
                    label:option.label,
                    sort:index
                }
            })
            await this.adminDictModel.insertMany(optionDocs)
        }
        console.log(enums)
    }

    // 字典类型相关方法
    async createType(createAdminDictTypeDto: CreateAdminDictTypeDto) {
        const exists = await this.adminDictTypeModel.findOne({
            type: createAdminDictTypeDto.type,
        });
        if (exists) {
            throw new ConflictException(`字典类型 ${createAdminDictTypeDto.type} 已存在`);
        }

        const created = new this.adminDictTypeModel(createAdminDictTypeDto);
        await created.save();
        return 'ok';
    }

    async findAllTypes(query: QueryAdminDictTypeDto) {
        const { page = 1, pageSize = 10, type, typeName, status } = query;
        const filter: any = {};

        if (type) {
            filter.type = { $regex: new RegExp(type, 'i') };
        }
        if (typeName) {
            filter.typeName = { $regex: new RegExp(typeName, 'i') };
        }
        if (status) {
            filter.status = status;
        }

        const total = await this.adminDictTypeModel.countDocuments(filter);
        const list = await this.adminDictTypeModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();

        return {
            list,
            total,
            page,
            pageSize,
        };
    }

    async findOneType(type: string) {
        const dictType = await this.adminDictTypeModel.findOne({ type });
        if (!dictType) {
            throw new NotFoundException(`字典类型 ${type} 不存在`);
        }
        return dictType;
    }

    async updateType(type: string, updateAdminDictTypeDto: UpdateAdminDictTypeDto) {
        const dictType = await this.adminDictTypeModel.findOne({ type });
        if (!dictType) {
            throw new NotFoundException(`字典类型 ${type} 不存在`);
        }

        // 如果要更新type，需要检查新type是否已存在
        if (updateAdminDictTypeDto.type && updateAdminDictTypeDto.type !== type) {
            const exists = await this.adminDictTypeModel.findOne({
                type: updateAdminDictTypeDto.type,
            });
            if (exists) {
                throw new ConflictException(`字典类型 ${updateAdminDictTypeDto.type} 已存在`);
            }
        }

        await this.adminDictTypeModel.findOneAndUpdate(
            { type },
            updateAdminDictTypeDto,
            { new: true },
        );
        return 'ok';
    }

    async removeType(type: string) {
        const dictType = await this.adminDictTypeModel.findOne({ type });
        if (!dictType) {
            throw new NotFoundException(`字典类型 ${type} 不存在`);
        }

        // 使用事务确保原子性
        const session = await this.adminDictTypeModel.db.startSession();
        try {
            await session.withTransaction(async () => {
                // 删除所有相关的字典项
                await this.adminDictModel.deleteMany({ type }).session(session);
                // 删除字典类型
                await this.adminDictTypeModel.findOneAndDelete({ type }).session(session);
            });
        } finally {
            await session.endSession();
        }

        return 'ok';
    }

    // 字典项相关方法
    async create(createAdminDictDto: CreateAdminDictDto) {
        // 检查字典类型是否存在
        const dictType = await this.adminDictTypeModel.findOne({
            type: createAdminDictDto.type,
            status: '0',
        });
        if (!dictType) {
            throw new NotFoundException(`字典类型 ${createAdminDictDto.type} 不存在或已禁用`);
        }

        // 检查同一type下的code是否已存在
        const exists = await this.adminDictModel.findOne({
            type: createAdminDictDto.type,
            code: createAdminDictDto.code,
        });
        if (exists) {
            throw new ConflictException(`字典编码 ${createAdminDictDto.code} 在类型 ${createAdminDictDto.type} 下已存在`);
        }

        const created = new this.adminDictModel(createAdminDictDto);
        await created.save();
        return 'ok';
    }

    async findAll(query: QueryAdminDictDto) {
        const { page = 1, pageSize = 10, type, code, label, status } = query;
        const filter: any = {};

        if (type) {
            filter.type = type;
        }
        if (code) {
            filter.code = { $regex: new RegExp(code, 'i') };
        }
        if (label) {
            filter.label = { $regex: new RegExp(label, 'i') };
        }
        if (status) {
            filter.status = status;
        }

        const [total, list, dictType] = await Promise.all([
            this.adminDictModel.countDocuments(filter),
            this.adminDictModel
                .find(filter)
                .sort({ type: 1, sort: 1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .exec(),
            type ? this.adminDictTypeModel.findOne({ type }) : null,
        ]);

        return {
            list,
            total,
            page,
            pageSize,
            typeName: dictType?.typeName,
        };
    }

    async findByType(type: string) {
        // 检查字典类型是否存在且启用
        const dictType = await this.adminDictTypeModel.findOne({ type, status: '0' });
        if (!dictType) {
            throw new NotFoundException(`字典类型 ${type} 不存在或已禁用`);
        }

        return this.adminDictModel
            .find({ type, status: '0' })
            .sort({ sort: 1 })
            .exec();
    }

    async findOne(type: string, code: string) {
        const [dict, dictType] = await Promise.all([
            this.adminDictModel.findOne({ type, code }),
            this.adminDictTypeModel.findOne({ type }),
        ]);

        if (!dict || !dictType) {
            throw new NotFoundException(`字典项不存在`);
        }

        return {
            ...dict.toObject(),
            typeName: dictType.typeName,
        };
    }

    async update(type: string, code: string, updateAdminDictDto: UpdateAdminDictDto) {
        const dict = await this.adminDictModel.findOne({ type, code });
        if (!dict) {
            throw new NotFoundException(`字典项不存在`);
        }

        // 如果要更新code，需要检查新code是否已存在
        if (updateAdminDictDto.code && updateAdminDictDto.code !== code) {
            const exists = await this.adminDictModel.findOne({
                type,
                code: updateAdminDictDto.code,
            });
            if (exists) {
                throw new ConflictException(`字典编码 ${updateAdminDictDto.code} 已存在`);
            }
        }

        await this.adminDictModel.findOneAndUpdate(
            { type, code },
            updateAdminDictDto,
            { new: true },
        );
        return 'ok';
    }

    async remove(type: string, code: string) {
        const result = await this.adminDictModel.findOneAndDelete({ type, code });
        if (!result) {
            throw new NotFoundException(`字典项不存在`);
        }
        return 'ok';
    }
}
