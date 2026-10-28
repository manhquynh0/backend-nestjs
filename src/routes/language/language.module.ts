import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller.js';
import { LanguageService } from './language.service.js';
import { LanguageRepo } from './lang.repo.js';

@Module({
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepo]
})
export class LanguageModule { }
