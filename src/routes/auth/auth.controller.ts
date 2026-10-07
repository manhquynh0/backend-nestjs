import { Controller, Body, Post, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterBodyDTO, RegisterResDTO } from './auth.dto.js'

@SerializeOptions({ type: RegisterResDTO })
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    register(@Body() body: RegisterBodyDTO) {
        const result = this.authService.register(body)
        return result
        // return new RegisterResDTO(result)
    }
}

