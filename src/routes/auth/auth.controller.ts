import { Controller, Body, Post, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginBodyDTO, RegisterBodyDTO, RegisterResDTO, LoginResDTO, RefreshTokenResDTO, RefreshTokenBodyDTO } from './auth.dto.js'

// @SerializeOptions({ type: RegisterResDTO })
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    async register(@Body() body: RegisterBodyDTO) {
        return new RegisterResDTO(await this.authService.register(body))
    }
    @Post('login')
    async login(@Body() body: LoginBodyDTO) {
        return new LoginResDTO(await this.authService.login(body))
    }
    @Post('refreshToken')
    async refreshToken(@Body() body: RefreshTokenBodyDTO) {
        return new RefreshTokenResDTO(await this.authService.refreshToken(body.refreshToken))
    }
    @Post('logout')
    logout(id: number) {
        return this.authService.logout(id)
    }
}

