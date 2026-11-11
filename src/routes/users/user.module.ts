import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { UserRepo } from './user.repo.js';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepo]
})
export class UserModule { }
