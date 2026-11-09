import { PrismaService } from "~/shared/services/prisma.service.js";
import { Injectable } from "@nestjs/common";
import { CreateRoleType, GetRoleParamsType, GetRolesParamsType, UpdateRoleType } from "./role.model.js";
@Injectable()
export class RoleReposistory {
    constructor(private readonly prisma: PrismaService) { }
    async getAll(query: GetRolesParamsType) {
        const [total, data] = await Promise.all([
            this.prisma.role.count({
                where: {
                    deletedAt: null
                }
            }),
            this.prisma.role.findMany({
                where: {
                    deletedAt: null
                },
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                include: {
                    permissions: {
                        where: {
                            permission: {
                                deletedAt: null
                            }
                        },
                        include: {
                            permission: true
                        }
                    }
                }
            }),
        ])
        return {
            data,
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / query.limit)
            }
        }
    }
    async getById(id: GetRoleParamsType) {
        return this.prisma.role.findFirst({
            where: {
                id: id.id,
                deletedAt: null,
            },
            include: {
                permissions: {
                    where: {
                        permission: {
                            deletedAt: null
                        }
                    },
                    include: {
                        permission: true
                    }
                }
            }
        })
    }
    async create(body: CreateRoleType, userId: number) {
        return this.prisma.role.create({
            data: {
                ...body,
                createdById: userId,
                updatedById: userId,
            }
        })
    }
    async update(id: GetRoleParamsType, body: UpdateRoleType, userId: number) {
        const { permissions, ...data } = body
        return this.prisma.role.update({
            where: {
                id: id.id,
                deletedAt: null
            },
            data: {
                ...data,
                updatedById: userId,
                ...(permissions !== undefined && {
                    permissions: {
                        deleteMany: {},
                        create: permissions.map((permissionId) => ({
                            permission_id: permissionId,
                        })),
                    }
                })

            },
            include: {
                permissions: {
                    where: {
                        permission: {
                            deletedAt: null
                        }
                    },
                    include: {
                        permission: true
                    }
                }
            }
        })
    }
    async delete(id: GetRoleParamsType, userId: number, isHard: boolean) {
        if (isHard) {
            return this.prisma.$transaction(async (tx) => {
                await tx.permissionsRoles.deleteMany({
                    where: {
                        role_id: id.id,
                    },
                })
                return tx.role.delete({
                    where: {
                        id: id.id,
                    },
                })
            })
        }
        return this.prisma.role.update({
            where: {
                id: id.id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date(),
                updatedById: userId
            }
        })
    }
    async findActiveByName(name: string) {
        return this.prisma.role.findFirst({
            where: {
                name,
                deletedAt: null
            }
        })
    }
}