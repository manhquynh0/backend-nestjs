import { Body, Controller, Get, Param, Post, Query, Put, Delete, ParseBoolPipe } from '@nestjs/common';
import { RolesService } from './role.service.js';
import { GetRolesParamsDto, RoleWithPermissionsDto, GetRoleParamsDto, ResRolesDto, ResRoleDto, CreateRoleDto, UpdateRoleDto } from './role.dto.js';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActiveUser } from '~/shared/decorators/activeUser.decorator.js';
import { MessageResDTO } from '../auth/auth.dto.js'

@Controller('roles')
export class RolesController {
    constructor(private readonly roleService: RolesService) { }

    @Get()
    @ZodSerializerDto(ResRolesDto)
    getAll(@Query() query: GetRolesParamsDto) {
        return this.roleService.getAll({
            page: query.page,
            limit: query.limit,
        })

    }
    @Get(':id')
    @ZodSerializerDto(RoleWithPermissionsDto)
    getDetail(@Param() id: GetRoleParamsDto) {
        return this.roleService.getDetail(id)
    }
    @Post()
    @ZodSerializerDto(ResRoleDto)
    create(@Body() body: CreateRoleDto, @ActiveUser('userId') userId: number) {
        return this.roleService.create(body, userId)
    }
    @Put(':id')
    @ZodSerializerDto(RoleWithPermissionsDto)
    update(@Param() id: GetRoleParamsDto, @Body() body: UpdateRoleDto, @ActiveUser('userId') userId: number) {
        return this.roleService.update(id, body, userId)
    }
    @Delete(':id')
    @ZodSerializerDto(MessageResDTO)
    delete(
        @Param() id: GetRoleParamsDto,
        @ActiveUser('userId') userId: number,
        @Query('isHard', new ParseBoolPipe({ optional: true })) isHard?: boolean,
    ) {
        return this.roleService.delete(id, userId, Boolean(isHard))
    }




}
