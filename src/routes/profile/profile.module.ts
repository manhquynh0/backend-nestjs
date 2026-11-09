import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { ProfileController } from './profile.controller.js';
import { ProfileRepo } from './profile.repo.js';
@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepo],
})
export class ProfileModule { }
