import { applyDecorators, SetMetadata } from "@nestjs/common";

export const PERMISSION_GROUP_KEY = 'PERMISSION_GROUP_KEY';
export const PERMISSION_GROUP_DESC = 'PERMISSION_GROUP_DESC';
export const PERMISSION_KEY = 'PERMISSION_KEY';
export const PERMISSION_DESC = 'PERMISSION_DESC';


/**设置权限组名 */
export const PermissionGroup = (groupName: string,description:string) => {
	return applyDecorators(
		SetMetadata(PERMISSION_GROUP_KEY, groupName),
		SetMetadata(PERMISSION_GROUP_DESC, description),
	)
}

/**设置权限key */
export const PermissionKey = (key: string,description?:string) => {
	return applyDecorators(
		SetMetadata(PERMISSION_KEY, key),
		SetMetadata(PERMISSION_DESC, description),
	)
}
