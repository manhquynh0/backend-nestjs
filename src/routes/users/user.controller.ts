import { Controller, Get, Query, Param } from '@nestjs/common';
import { UserService } from './user.service.js';
import { GetQueryDto, ResUserDto, GetParamsDto, ResUsersDto } from './user.dto.js';
import { ZodSerializerDto } from 'nestjs-zod';
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }
    @Get()
    @ZodSerializerDto(ResUserDto)
    getAll(@Query() query: GetQueryDto) {
        return this.userService.getAll({
            page: query.page,
            limit: query.limit,
        })
    }
    @Get(':userId')
    @ZodSerializerDto(ResUsersDto)
    getById(@Param() userId: GetParamsDto) {
        return this.userService.getById(userId)
    }
}
