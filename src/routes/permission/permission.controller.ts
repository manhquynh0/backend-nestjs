import { Body, Controller, Get, Post, Query, Param, UseGuards, Put, Delete } from '@nestjs/common';
import { PermissionService } from "./permission.service.js"
import { CreatePermissionDto, GetPermissionParamsDto, GetPermissionsParamsDto, GetPermissionsResDto, UpdatePermissionDto, ResPermissionDto } from './permission.dto.js';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActiveUser } from '~/shared/decorators/activeUser.decorator.js';
import { MessageResDTO } from '../auth/auth.dto.js';

@Controller('permission')
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService
    ) { }
    @Get()
    @ZodSerializerDto(GetPermissionsResDto)
    getAll(@Query() query: GetPermissionsParamsDto) {
        return this.permissionService.getAll({
            page: query.page,
            limit: query.limit
        })
    }
    @Get(':permissionId')
    @ZodSerializerDto(ResPermissionDto)
    getDetail(@Param() params: GetPermissionParamsDto) {
        return this.permissionService.getDetail(params.permissionId)
    }

    @Post()
    @ZodSerializerDto(ResPermissionDto)
    create(@Body() body: CreatePermissionDto, @ActiveUser('userId') userId: number) {
        return this.permissionService.create(body, userId)
    }
    @Put(':permissionId')
    @ZodSerializerDto(ResPermissionDto)
    update(@Param() params: GetPermissionParamsDto, @Body() body: UpdatePermissionDto, @ActiveUser('userId') userId: number) {
        return this.permissionService.update(params.permissionId, body, userId)
    }
    @Delete(':permissionId')
    @ZodSerializerDto(MessageResDTO)
    delete(@Param() params: GetPermissionParamsDto, @ActiveUser('userId') userId: number, @Body() body: {
        isHard: boolean
    }) {
        return this.permissionService.delete(params.permissionId, userId, body.isHard)
    }




}
