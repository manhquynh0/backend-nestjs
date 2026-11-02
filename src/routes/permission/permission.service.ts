import { Injectable } from '@nestjs/common';
import { PermissionRepo } from './permission.repo.js';
import type { GetPermissionsParamsType, CreatePermissionBodyType, UpdatePermissionBodyType } from './permission.model.js';
import { PermissionAlreadyExistsException, PermissionNotFoundException } from './permission.err.js';
import { isNotFoundError, isUniqueConstraintError } from '~/shared/helpers.js';

@Injectable()
export class PermissionService {
    constructor(
        private readonly permisionRepo: PermissionRepo
    ) { }
    async getAll(pagination: GetPermissionsParamsType) {
        return await this.permisionRepo.getAll(pagination)
    }
    async create(body: CreatePermissionBodyType, userId: number) {
        try {
            return await this.permisionRepo.create(body, userId)
        } catch (error) {
            if (isUniqueConstraintError(error)) throw PermissionAlreadyExistsException()
            throw error
        }
    }
    async getDetail(id: number) {
        const permission = await this.permisionRepo.getById(id)
        if (!permission) throw PermissionNotFoundException()
        return permission
    }
    async update(id: number, body: UpdatePermissionBodyType, userId: number) {
        const permission = await this.permisionRepo.getById(id)
        if (!permission) throw PermissionNotFoundException()
        return await this.permisionRepo.update(id, body, userId)
    }
    async delete(id: number, userId: number, isHard: boolean) {
        try {
            await this.permisionRepo.delete(id, userId, isHard)
            return { message: 'Xoá permission thành công' }
        } catch (error) {
            if (isNotFoundError(error)) throw PermissionNotFoundException()
            throw error
        }
    }
}
