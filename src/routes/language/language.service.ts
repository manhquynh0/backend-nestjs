import { Injectable } from '@nestjs/common';
import { LanguageRepo } from './lang.repo.js';
import { LanguageCreateBodyType, LanguageUpdateBodyType } from './lang.model.js';

@Injectable()
export class LanguageService {
    constructor(private readonly languageRepo: LanguageRepo) { }

    async getAll() {
        return this.languageRepo.findAll()
    }
    async getById(id: string) {
        return this.languageRepo.findById(id)
    }
    async create(data: LanguageCreateBodyType, createdById: number) {
        return this.languageRepo.create({ data, createdById })
    }
    async update(id: string, data: LanguageUpdateBodyType, updatedById: number) {
        return this.languageRepo.update({ id, data, updatedById })
    }
    async delete(id: string, isHard: boolean = false) {
        await this.languageRepo.delete({ id, isHard })
        return { message: 'Language deleted successfully' }
    }
}
