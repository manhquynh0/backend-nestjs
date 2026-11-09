import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
@Injectable()
export class ProfileRepo {
    constructor(private readonly prismaService: PrismaService,
    ) { }
    async getProfile(userId: number) {
        return this.prismaService.user.findUnique({
            where: {
                id: userId,
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                avatar: true,
                status: true,
                createdAt: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        permissions: {
                            where: {
                                permission: {
                                    deletedAt: null
                                }
                            },
                            select: {
                                permission: {
                                    select: {
                                        id: true,
                                        name: true,
                                        path: true,
                                        method: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }
    async findUser(userId: number) {
        return this.prismaService.user.findUnique({
            where: {
                id: userId,
                deletedAt: null
            },
            select: {
                password: true
            }
        })
    }
    async deletedRefreshToken(userId: number) {
        return this.prismaService.refreshToken.deleteMany({
            where: {
                userId,
            }
        })
    }
}