import { PartialType } from '@nestjs/swagger';
import { CreateAdminDictTypeDto } from './create-admin-dict-type.dto';

export class UpdateAdminDictTypeDto extends PartialType(CreateAdminDictTypeDto) {}
