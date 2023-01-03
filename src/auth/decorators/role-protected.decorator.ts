import { SetMetadata } from "@nestjs/common"
import { ValidRoles } from "../enums/roles.enum"
export const META_ROLES_NAME = 'roles';
export const RoleProtected = (...roles: ValidRoles[]) => {
    return SetMetadata(META_ROLES_NAME, roles)
}