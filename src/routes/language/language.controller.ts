import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { LanguageBodyDTO, LanguageCreateBodyDTO, LanguageUpdateBodyDTO, GetLanguageDetailResDTO, GetLanguageParamsDTO, GetLanguageResDTO } from './lang.dto.js';
import { LanguageService } from './language.service.js'
import { ZodSerializerDto } from "nestjs-zod"
import { ActiveUser } from '~/shared/decorators/activeUser.decorator.js';
import { MessageResDTO } from "~/shared/dtos/response.dto.js"
@Controller('language')
export class LanguageController {
    constructor(private readonly languageService: LanguageService) { }
    @Get()
    @ZodSerializerDto(GetLanguageResDTO)
    async getAll() {
        return this.languageService.getAll()
    }
    @Get(':languageId')
    @ZodSerializerDto(GetLanguageDetailResDTO)
    async getById(@Param() params: GetLanguageParamsDTO,) {
        return this.languageService.getById(params.languageId)
    }
    @Post()
    @ZodSerializerDto(LanguageBodyDTO)
    async create(@Body() body: LanguageCreateBodyDTO, @ActiveUser('userId') userId: number) {
        return this.languageService.create(body, userId)
    }
    @Put(':languageId')
    @ZodSerializerDto(LanguageBodyDTO)
    async update(@Param() params: GetLanguageParamsDTO, @Body() body: LanguageUpdateBodyDTO, @ActiveUser('userId') userId: number) {
        return this.languageService.update(params.languageId, body, userId)
    }
    @Delete(':languageId')
    @ZodSerializerDto(MessageResDTO)
    async delete(@Param() params: GetLanguageParamsDTO, @Body() body?: { isHard?: boolean }) {
        return this.languageService.delete(params.languageId, body?.isHard ?? false)
    }

}
