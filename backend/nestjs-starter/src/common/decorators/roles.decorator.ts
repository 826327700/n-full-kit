import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';

export const NO_CHECK_ROLES_KEY = 'NO_CHECK_ROLES';

/**检查角色权限 */
export const CheckRoles = () => {
  return applyDecorators(
    UseGuards(RolesGuard)
  );
};

/**不检查角色权限 */
export const NoCheckRoles=()=>SetMetadata(NO_CHECK_ROLES_KEY,true)