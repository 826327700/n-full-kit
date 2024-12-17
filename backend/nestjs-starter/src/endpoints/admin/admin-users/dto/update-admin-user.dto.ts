import { PartialType } from '@nestjs/swagger';
import { CreateAdminUserDto } from './create-admin-user.dto';

export class UpdateAdminUserDto extends PartialType(CreateAdminUserDto) {}
