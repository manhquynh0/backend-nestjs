import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    register(@Body() body: any) {
        return this.authService.register(body)
    }
}
