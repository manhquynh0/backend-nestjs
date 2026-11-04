import { Injectable } from '@nestjs/common';
import { RoleReposistory } from './role.repo.js';
import { CreateRoleType, GetRoleParamsType, GetRolesParamsType, UpdateRoleType } from './role.model.js';
import { RoleAlreadyExistsException, RoleNotFoundException } from './role.error.js';

@Injectable()
export class RolesService {
    constructor(private readonly roleRepo: RoleReposistory) { }
    async getAll(query: GetRolesParamsType) {
        const result = await this.roleRepo.getAll(query)
        return {
            ...result,
            data: result.data.map((role) => ({
                ...role,
                permissions: role.permissions.map((p) => p.permission_id)
            }))

        }

    }
    async getDetail(id: GetRoleParamsType) {
        const role = await this.roleRepo.getById(id)
        if (!role) {
            throw RoleNotFoundException()
        }
        return {
            ...role,
            permissions: role.permissions.map((p) => p.permission_id),
        }
    }
    async create(body: CreateRoleType, userId: number) {
        // 1. Kiểm tra trùng tên role đang active
        const existing = await this.roleRepo.findActiveByName(body.name)
        if (existing) {
            throw RoleAlreadyExistsException(body.name)
        }
        return this.roleRepo.create(body, userId)
    }

    async update(id: GetRoleParamsType, body: UpdateRoleType, userId: number) {
        const role = await this.roleRepo.getById(id)
        if (!role) {
            throw RoleNotFoundException()
        }
        if (body.name && role.name !== body.name) {
            const existing = await this.roleRepo.findActiveByName(body.name)
            if (existing) {
                throw RoleAlreadyExistsException(body.name)
            }
        }
        const updated = await this.roleRepo.update(id, body, userId)
        return {
            ...updated,
            permissions: updated.permissions.map((p) => p.permission_id),
        }
    }
    async delete(id: GetRoleParamsType, userId: number, isHard: boolean) {
        const role = await this.roleRepo.getById(id)
        if (!role) {
            throw RoleNotFoundException()
        }
        await this.roleRepo.delete(id, userId, isHard)
        return {
            message: "Delete role successfully"
        }
    }


}
