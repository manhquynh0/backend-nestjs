import { Injectable } from "@nestjs/common";
import { PrismaService } from "~/shared/services/prisma.service.js";
import type { CreatePermissionBodyType, GetPermissionsParamsType, PermissionType, UpdatePermissionBodyType } from "./permission.model.js";

@Injectable()
export class PermissionRepo {
    constructor(private readonly prisma: PrismaService) {

    }
    async getAll(pagination: GetPermissionsParamsType) {
        const skip = (pagination.page - 1) * pagination.limit
        const take = pagination.limit
        const where = {
            deletedAt: null
        }
        const [totalItem, data] = await Promise.all([
            this.prisma.permission.count({ where }),
            this.prisma.permission.findMany({
                skip,
                take,
                where,
                orderBy: { name: 'asc' }
            })
        ])
        return { data, pagination: { page: pagination.page, limit: pagination.limit, total: totalItem, totalPages: Math.ceil(totalItem / pagination.limit) } }
    }
    async create(data: CreatePermissionBodyType, userId: number): Promise<PermissionType> {
        return await this.prisma.permission.create({
            data: {
                name: data.name,
                description: data.description ?? '',
                path: data.path,
                method: data.method,
                createdById: userId,
            }
        })
    }
    async getById(id: number): Promise<PermissionType | null> {
        return await this.prisma.permission.findUnique({
            where: {
                id,
                deletedAt: null
            }
        })
    }
    async update(id: number, data: UpdatePermissionBodyType, userId: number): Promise<PermissionType> {
        return await this.prisma.permission.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                ...data,
                updatedById: userId,
            }
        })
    }
    async delete(id: number, userId: number, isHard: boolean) {
        if (isHard) {
            return this.prisma.$transaction(async (tx) => {
                await tx.permissionsRoles.deleteMany({
                    where: {
                        permission_id: id
                    }
                })
                return await tx.permission.delete({
                    where: {
                        id
                    }
                })
            })
        }
        return await this.prisma.permission.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date(),
                updatedById: userId
            }
        })
    }



}
