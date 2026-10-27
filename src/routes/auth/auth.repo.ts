import { Injectable } from "@nestjs/common";
import { PrismaService } from "~/shared/services/prisma.service.js";
import { RegisterBodyType, VerificationCodeType, DeviceType, RoleType, RefreshTokenSchemaType } from "./auth.model.js";
import { UserType } from "~/shared/model/shared-user-model.js"
import { TypeOfVerificationCode } from "~/shared/constanst/auth.constant.js"
@Injectable()
export class AuthRepository {
    constructor(
        private readonly prismaService: PrismaService
    ) { }
    async createUser(user: Pick<UserType, 'roleId' | 'email' | 'name' | 'phoneNumber' | 'avatar' | 'password'>) {
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
                expiresAt: payload.expiresAt,
                type: payload.type
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
    async findDevice(payload: Pick<DeviceType, 'userId' | 'ip' | 'userAgent'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>) {
        return this.prismaService.device.findFirst({
            where: {
                userId: payload.userId,
                ip: payload.ip,
            }
        })
    }
    async updateDevice(id: number, payload: Pick<DeviceType, 'userId' | 'ip' | 'userAgent'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>) {
        return this.prismaService.device.update({
            where: {
                id
            },
            data: payload
        })
    }
    async findUniqueRefreshToken(uniqueObject: { token: string }): Promise<RefreshTokenSchemaType & { user: UserType & { role: RoleType } } | null> {
        return this.prismaService.refreshToken.findUnique({
            where: uniqueObject,
            include: {
                user: {
                    include: {
                        role: true
                    }
                }
            }
        })
    }
    async deleteRefreshToken(token: string) {
        return this.prismaService.refreshToken.delete({
            where: {
                token
            }
        })
    }
    async deleteRefreshTokensByDeviceId(deviceId: number) {
        return this.prismaService.refreshToken.deleteMany({
            where: {
                deviceId
            }
        })
    }
    async deleteVerificationCode(id: number) {
        return this.prismaService.verificationCode.delete({
            where: { id }
        })
    }
    async deleteRefreshTokensByUserId(userId: number) {
        return this.prismaService.refreshToken.deleteMany({
            where: { userId }
        })
    }
}