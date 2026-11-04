import { Module } from '@nestjs/common';
import { RolesController } from './role.controller.js';
import { RolesService } from './role.service.js';
import { RoleReposistory } from './role.repo.js'
@Module({
  controllers: [RolesController],
  providers: [RolesService, RoleReposistory]
})
export class RolesModule { }
