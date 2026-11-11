import { Injectable } from "@nestjs/common";
import { PrismaService } from "~/shared/services/prisma.service.js"
import type { GetQueryDto, GetParamsDto } from './user.dto.js';
@Injectable()
export class UserRepo {
    constructor(private readonly prisma: PrismaService) { }
    async getAll(query: GetQueryDto) {
        const [total, data] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.findMany({
                where: {
                    deletedAt: null
                },
                take: query.limit,
                skip: (query.page - 1) * query.limit,
                include: {
                    role: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })
        ])
        return {
            data,
            page: query.page,
            limit: query.limit,
            total: total,
            totalPages: Math.ceil(total / query.limit)

        }
    }
    async getById(userId: GetParamsDto) {
        return await this.prisma.user.findUnique({
            where: {
                id: userId.userId,
                deletedAt: null
            },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

    }
}