import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { roleName } from '~/shared/constants/role.constant.js'
@Injectable()
export class RolesRepository {
    constructor(private readonly prismaService: PrismaService) { }

    private roleId: Record<string, number> = {}
    async getRoleId(roleName: string) {
        if (!this.roleId[roleName]) {
            this.roleId[roleName] = await this.prismaService.role.findFirstOrThrow({
                where: {
                    name: roleName,
                    deletedAt: null
                },
                select: {
                    id: true
                }
            })
                .then((role) => role.id)
        }
        return this.roleId[roleName]
    }
}
