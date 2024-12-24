import { PartialType } from '@nestjs/swagger';
import { CreateAdminDictDto } from './create-admin-dict.dto';

export class UpdateAdminDictDto extends PartialType(CreateAdminDictDto) {}
