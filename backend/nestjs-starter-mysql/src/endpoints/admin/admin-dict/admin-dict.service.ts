import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminDict } from './entities/admin-dict.entity';
import { AdminDictType } from './entities/admin-dict-type.entity';
import { CreateAdminDictDto } from './dto/create-admin-dict.dto';
import { CreateAdminDictTypeDto } from './dto/create-admin-dict-type.dto';
import { UpdateAdminDictDto } from './dto/update-admin-dict.dto';
import { UpdateAdminDictTypeDto } from './dto/update-admin-dict-type.dto';
import { QueryAdminDictTypeDto } from './dto/query-admin-dict-type.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Like } from 'typeorm';

@Injectable()
export class AdminDictService {
    constructor(
        @InjectRepository(AdminDict)
        private adminDictRepository: Repository<AdminDict>,
        @InjectRepository(AdminDictType)
        private adminDictTypeRepository: Repository<AdminDictType>,
    ) {
        this.importEnumDict();
    }

    async importEnumDict() {
        const enumFile = path.resolve(__dirname, '../../../../static/enum.json');

        if (!fs.existsSync(enumFile)) {
            return;
        }
        const enums = fs.readFileSync(enumFile, 'utf-8');
        const enumsJson = JSON.parse(enums) as Record<string, any>[];
        for (const item of enumsJson) {
            const existingType = await this.adminDictTypeRepository.findOne({
                where: { type: item.labelKey }
            });
            if (existingType) {
                await this.adminDictTypeRepository.update({ type: item.labelKey }, {
                    type: item.labelKey,
                    typeName: item.labelName,
                    from: 'system'
                });
            } else {
                await this.adminDictTypeRepository.save({
                    type: item.labelKey,
                    typeName: item.labelName,
                    from: 'system'
                });
            }

            await this.adminDictRepository.delete({ type: item.labelKey });
            const optionDocs = item.options.map((option, index) => ({
                type: item.labelKey,
                code: option.value,
                label: option.label,
                sort: index,
            }));
            await this.adminDictRepository.save(optionDocs);
        }
    }

    async createType(createAdminDictTypeDto: CreateAdminDictTypeDto) {
        const exists = await this.adminDictTypeRepository.findOne({
            where: { type: createAdminDictTypeDto.type },
        });
        if (exists) {
            throw new ConflictException(`字典类型 ${createAdminDictTypeDto.type} 已存在`);
        }

        const created = this.adminDictTypeRepository.create(createAdminDictTypeDto);
        await this.adminDictTypeRepository.save(created);
        return 'ok';
    }

    async findAllTypes(query: QueryAdminDictTypeDto) {
        const { page = 1, pageSize = 10, keyword, status } = query;
        const filter: any = {};

        if (keyword) {
            filter.$or = [
                { type: Like(`%${keyword}%`) },
                { typeName: Like(`%${keyword}%`) },
            ];
        }
        if (status) {
            filter.status = status;
        }

        const total = await this.adminDictTypeRepository.count({ where: filter });
        const list = await this.adminDictTypeRepository.find({
            where: filter,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { id: 'DESC' },
        });

        return {
            list,
            total,
            page,
            pageSize,
        };
    }

    async updateType(type: string, updateAdminDictTypeDto: UpdateAdminDictTypeDto) {
        const dictType = await this.adminDictTypeRepository.findOne({ where: { type } });
        if (!dictType) {
            throw new NotFoundException(`字典类型 ${type} 不存在`);
        }

        if (updateAdminDictTypeDto.type && updateAdminDictTypeDto.type !== type) {
            const exists = await this.adminDictTypeRepository.findOne({
                where: { type: updateAdminDictTypeDto.type },
            });
            if (exists) {
                throw new ConflictException(`字典类型 ${updateAdminDictTypeDto.type} 已存在`);
            }
        }

        await this.adminDictTypeRepository.update({ type }, updateAdminDictTypeDto);
        return 'ok';
    }

    async removeType(type: string) {
        const dictType = await this.adminDictTypeRepository.findOne({ where: { type } });
        if (!dictType) {
            throw new NotFoundException(`字典类型 ${type} 不存在`);
        }

        await this.adminDictRepository.delete({ type });
        await this.adminDictTypeRepository.delete({ type });

        return 'ok';
    }

    async create(createAdminDictDto: CreateAdminDictDto) {
        const dictType = await this.adminDictTypeRepository.findOne({
            where: { type: createAdminDictDto.type, status: '0' },
        });
        if (!dictType) {
            throw new NotFoundException(`字典类型 ${createAdminDictDto.type} 不存在或已禁用`);
        }

        const exists = await this.adminDictRepository.findOne({
            where: { type: createAdminDictDto.type, code: createAdminDictDto.code },
        });
        if (exists) {
            throw new ConflictException(`字典编码 ${createAdminDictDto.code} 在类型 ${createAdminDictDto.type} 下已存在`);
        }

        const created = this.adminDictRepository.create(createAdminDictDto);
        await this.adminDictRepository.save(created);
        return 'ok';
    }

    async findByType(type: string) {
        const dictType = await this.adminDictTypeRepository.findOne({ where: { type, status: '0' } });
        if (!dictType) {
            throw new NotFoundException(`字典类型 ${type} 不存在或已禁用`);
        }

        return this.adminDictRepository.find({
            where: { type, status: '0' },
            order: { sort: 'ASC' },
        });
    }

    async update(type: string, code: string, updateAdminDictDto: UpdateAdminDictDto) {
        const dict = await this.adminDictRepository.findOne({ where: { type, code } });
        if (!dict) {
            throw new NotFoundException(`字典项不存在`);
        }

        if (updateAdminDictDto.code && updateAdminDictDto.code !== code) {
            const exists = await this.adminDictRepository.findOne({
                where: { type, code: updateAdminDictDto.code },
            });
            if (exists) {
                throw new ConflictException(`字典编码 ${updateAdminDictDto.code} 已存在`);
            }
        }

        await this.adminDictRepository.update({ type, code }, updateAdminDictDto);
        return 'ok';
    }

    async remove(type: string, code: string) {
        const result = await this.adminDictRepository.delete({ type, code });
        if (!result.affected) {
            throw new NotFoundException(`字典项不存在`);
        }
        return 'ok';
    }
}
