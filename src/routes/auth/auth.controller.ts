import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common"
import { AuthService } from "./auth.service.js"
import { RegisterDTO, RegisterResDTO, SendOtpDTO } from "./auth.dto.js"
import { ZodSerializerDto } from "nestjs-zod"

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    // @Post('login')
    // @HttpCode(HttpStatus.OK)
    // async login(@Body() body: any) {
    //     return this.authService.login(body);
    // }
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ZodSerializerDto(RegisterResDTO)
    async register(@Body() body: RegisterDTO) {
        return this.authService.register(body)
    }
    @Post('otp')
    async sendOtp(@Body() body: SendOtpDTO) {
        return this.authService.sendOtp(body)
    }
    // @Post('logout')
    // @HttpCode(HttpStatus.OK)
    // async logout(@Body() body: any) {
    //     return this.authService.logout(body);
    // }
    // @Post('refresh-token')
    // @HttpCode(HttpStatus.OK)
    // async refreshToken(@Body() body: any) {
    //     return this.authService.refreshToken(body);
    // }
}