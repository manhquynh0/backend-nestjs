import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RolesService } from './roles.service.js';
import { AuthController } from './auth.controller.js';
import { AuthRepository } from './auth.repo.js';
import { GoogleService } from './google.service.js';

@Module({
  providers: [AuthService, RolesService, AuthRepository, GoogleService],
  controllers: [AuthController]
})
export class AuthModule { }
