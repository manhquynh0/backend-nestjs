import { Body, Controller, HttpCode, HttpStatus, Ip, Post, Get, Query, Res, HttpException, BadRequestException } from "@nestjs/common"
import type { Response } from "express"
import { AuthService } from "./auth.service.js"
import { RegisterDTO, RegisterResDTO, SendOtpDTO, LoginDTO, LoginResDTO, RefreshTokenResDTO, RefreshTokenBodyDTO, MessageResDTO, LogoutDTO, GetAuthorizationUrlResDTO, ForgotPasswordDTO } from "./auth.dto.js"
import { ZodSerializerDto } from "nestjs-zod"
import { UserAgent } from "~/shared/decorators/user-agent.decorator.js";
import { GoogleService } from "./google.service.js";
import { IsPublic } from "~/shared/decorators/auth.decorator.js";
import envConfig from "~/shared/config.js";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly googleService: GoogleService) { }

    @IsPublic()
    @Post('login')
    @ZodSerializerDto(LoginResDTO)
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() body: LoginDTO,
        @Ip() ip: string,
        @UserAgent() userAgent: string
    ) {
        return this.authService.login(body, { ip, userAgent });
    }
    @IsPublic()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ZodSerializerDto(RegisterResDTO)
    async register(@Body() body: RegisterDTO) {
        return this.authService.register(body)
    }
    @IsPublic()
    @Post('otp')
    async sendOtp(@Body() body: SendOtpDTO) {
        return this.authService.sendOtp(body)
    }
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ZodSerializerDto(MessageResDTO)
    async logout(@Body() body: LogoutDTO) {
        return this.authService.logout(body);
    }
    @Post('refreshToken')
    @HttpCode(HttpStatus.OK)
    @ZodSerializerDto(RefreshTokenResDTO)
    async refreshToken(@Body() body: RefreshTokenBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
        return this.authService.refreshToken(body, { ip, userAgent });
    }
    @IsPublic()
    @Get("google")
    @HttpCode(HttpStatus.OK)
    @ZodSerializerDto(GetAuthorizationUrlResDTO)
    async getAuhtorizationUrl(@UserAgent() userAgent: string, @Ip() ip: string) {
        return this.googleService.getAuthorizationUrl({
            userAgent,
            ip
        })
    }
    @Get('google/callback')
    @IsPublic()
    async googleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
        try {
            if (!code) {
                throw new BadRequestException('Authorization code is missing')
            }
            const data = await this.googleService.googleCallback({ code, state }) as any
            return res.redirect(
                `${envConfig.GOOGLE_URI}/oauth-google-callback?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`
            )
        } catch (error) {
            const message = error instanceof HttpException ? error.message : "Failed to login with Google"
            return res.redirect(
                `${envConfig.GOOGLE_URI}/oauth-google-callback?errorMessage=${encodeURIComponent(message)}`
            )
        }
    }

    @Post('forgot-password')
    @IsPublic()
    @ZodSerializerDto(MessageResDTO)
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() body: ForgotPasswordDTO) {
        return this.authService.forgotPassword(body)
    }




}