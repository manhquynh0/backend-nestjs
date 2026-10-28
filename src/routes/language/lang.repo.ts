import { Injectable } from "@nestjs/common"
import { PrismaService } from "~/shared/services/prisma.service.js"
import { LanguageCreateBodyType, LanguageUpdateBodyType } from "./lang.model.js"

@Injectable()
export class LanguageRepo {
    constructor(private readonly prismaService: PrismaService) {
    }
    async findAll() {
        return this.prismaService.language.findMany({
            where: {
                deletedAt: null
            }
        })
    }
    async findById(id: string) {
        return this.prismaService.language.findUnique({
            where: {
                id,
                deletedAt: null
            }
        })
    }
    async create({ data, createdById }: { data: LanguageCreateBodyType, createdById: number }) {
        return this.prismaService.language.create({
            data: {
                ...data,
                createdById
            }
        })
    }
    async update({ id, data, updatedById }: { id: string, data: LanguageUpdateBodyType, updatedById: number }) {
        return this.prismaService.language.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                ...data,
                updatedById
            }
        })
    }
    async delete({ id, isHard }: { id: string, isHard: boolean }) {
        if (isHard) {
            return this.prismaService.language.delete({
                where: {
                    id
                }
            })
        }
        return this.prismaService.language.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            }
        })
    }
}