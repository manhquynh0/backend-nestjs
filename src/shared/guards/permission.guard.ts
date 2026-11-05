import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "~/shared/services/prisma.service.js";
import { AccessTokenPayload } from "~/shared/types/token.type.js"
import { roleName } from "../constants/role.constant.js"
import { PER_METHOD } from "../constants/permission.constant.js"
import { REQUEST_USER_KEY } from "../constants/auth.constant.js";
@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly prismaService: PrismaService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (request["isPublic"]) return true
        const user = request[REQUEST_USER_KEY] as AccessTokenPayload | undefined
        if (!user) return false

        if (user.roleName === roleName.Admin) return true
        const method = request.method?.toUpperCase() as (typeof PER_METHOD)[number]
        const path = request.route?.path as string
        if (!path) return true
        // Lấy danh sách permission được gán cho role của user
        const rolePermissions = await this.prismaService.permissionsRoles.findMany({
            where: {
                role_id: user.roleId,
                permission: {
                    deletedAt: null,
                },
            },
            include: {
                permission: true,
            },
        })
        console.log('rolePermissions', rolePermissions)
        // Kiểm tra xem cặp (method, path) có nằm trong danh sách permission của role không
        const hasPermission = rolePermissions.some(
            (item) => item.permission.method === method && item.permission.path === path,
        )
        if (!hasPermission) {
            throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này')
        }
        return true

    }

}