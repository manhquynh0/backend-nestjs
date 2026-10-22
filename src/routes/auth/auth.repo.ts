import { Injectable } from "@nestjs/common";
import { PrismaService } from "~/shared/services/prisma.service.js";
import { RegisterBodyType, VerificationCodeType, DeviceType, RoleType } from "./auth.model.js";
import { UserType } from "~/shared/model/shared-user-model.js"
import { TypeOfVerificationCode } from "~/shared/constanst/auth.constant.js"
@Injectable()
export class AuthRepository {
    constructor(
        private readonly prismaService: PrismaService
    ) { }
    async createUser(user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>) {
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
    async findUniqueVerificationCode(uniValue: { email: string } | { id: number } | {
        email: string,
        code: string,
        type: TypeOfVerificationCode
    }) {
        return this.prismaService.verificationCode.findUnique({
            where: uniValue
        })
    }
    async createRefreshToken(payload: { userId: number, token: string, expiresAt: Date, deviceId: number }) {
        return this.prismaService.refreshToken.create({
            data: payload
        })
    }
    async createDevice(payload: Pick<DeviceType, 'userId' | 'ip' | 'userAgent'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>) {
        return this.prismaService.device.create({
            data: payload
        })
    }
    async findUniqueUserWithRole(uniqueObject: { email: string } | { id: number }): Promise<UserType & { role: RoleType } | null> {
        return this.prismaService.user.findUnique({
            where: uniqueObject,
            include: {
                role: true
            }
        })
    }
}