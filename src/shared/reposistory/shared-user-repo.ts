import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service.js";

import { UserType } from "../model/shared-user-model.js";

@Injectable()
export class SharedUserRepo {
    constructor(
        private readonly prismaService: PrismaService
    ) { }
    async findUniqueUser(uniqueObject: { email: string } | { id: number }): Promise<UserType | null> {
        return this.prismaService.user.findUnique({
            where: uniqueObject
        })
    }
}

