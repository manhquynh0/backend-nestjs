import { Injectable, NotFoundException } from '@nestjs/common';
import type { GetQueryDto, GetParamsDto } from './user.dto.js';
import { UserRepo } from './user.repo.js';
@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepo,
    ) { }
    async getAll(query: GetQueryDto) {
        return this.userRepo.getAll(query)

    }
    async getById({ userId }: GetParamsDto) {
        const result = await this.userRepo.getById({ userId });
        if (!result) {
            throw new NotFoundException('User not found')
        }
        return result
    }
}
