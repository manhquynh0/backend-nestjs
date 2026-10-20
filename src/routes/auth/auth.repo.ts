import { Injectable } from "@nestjs/common";
import { PrismaService } from "~/shared/services/prisma.service.js";
import { RegisterBodyType, VerificationCodeType } from "./auth.model.js";
import { UserType } from "~/shared/model/shared-user-model.js"

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
    async createVerificationCode(payload: Pick<VerificationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>) {
        return this.prismaService.verificationCode.upsert({
            where: {
                email: payload.email
            },
            update: {
                code: payload.code,
                expiresAt: payload.expiresAt
            },
            create: payload
        })
    }
}