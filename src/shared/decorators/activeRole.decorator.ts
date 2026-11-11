import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { REQUEST_ROLE_KEY } from '../constants/role.constant.js'
import { RolePermissionType } from '../model/shared-role.model.js'
export const ActiveRole = createParamDecorator(
    (field: keyof RolePermissionType | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const rolePermissions: RolePermissionType | undefined = request[REQUEST_ROLE_KEY]
        return field ? rolePermissions?.[field] : rolePermissions
    },
)

