import { Injectable } from "@nestjs/common";
import { PrismaService } from "~/shared/services/prisma.service.js";
import { RegisterBodyType, UserType } from "./auth.model.js";

@Injectable()
export class AuthRepository {
    constructor(
        private readonly prismaService: PrismaService
    ) { }
    async createUser(user: Omit<RegisterBodyType, 'confirmPassword'> & Pick<UserType, 'roleId'>) {
        return this.prismaService.user.create({
            data: user,
            omit: {
                password: true,
                totpSecret: true
            }
        })

    }
}