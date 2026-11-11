import { Module } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'
import { AuthRepository } from './auth.repo.js'
import { GoogleService } from './google.service.js'

@Module({
  providers: [AuthService, AuthRepository, GoogleService],
  controllers: [AuthController],
})
export class AuthModule { }
