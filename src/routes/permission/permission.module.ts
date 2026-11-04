import { Module } from '@nestjs/common'
import { PermissionController } from './permission.controller.js'
import { PermissionService } from './permission.service.js'
import { PermissionRepo } from './permission.repo.js'
@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepo],
})
export class PermissionModule {}
