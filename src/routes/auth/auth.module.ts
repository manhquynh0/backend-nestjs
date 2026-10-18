import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RolesService } from './roles.service.js';
import { AuthController } from './auth.controller.js';

@Module({
  providers: [AuthService, RolesService],
  controllers: [AuthController]
})
export class AuthModule { }
