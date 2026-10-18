import { Injectable } from "@nestjs/common";
import { PrismaService } from "~/shared/services/prisma.service.js";
import { roleName } from '~/shared/constanst/role.constants.js'
@Injectable()
export class RolesService {
    constructor(private readonly prismaService: PrismaService) { }

    private clientRoleId: number | null = null;
    async getClientRoleId() {
        if (!this.clientRoleId) {
            this.clientRoleId = await this.prismaService.role.findFirstOrThrow({
                where: {
                    name: roleName.User
                }
            }).then(role => role.id);
        }
        return this.clientRoleId;
    }
} 