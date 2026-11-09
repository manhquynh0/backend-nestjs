import { createZodDto } from 'nestjs-zod'
import { CreateRoleSchema, GetRoleParamsSchema, GetRolesParamsSchema, UpdateRoleSchema, ResRoleSchema, ResRolesSchema, RoleWithPermissionsSchema } from './role.model.js'

export class CreateRoleDto extends createZodDto(CreateRoleSchema) { }
export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) { }
export class GetRoleParamsDto extends createZodDto(GetRoleParamsSchema) { }
export class GetRolesParamsDto extends createZodDto(GetRolesParamsSchema) { }
export class ResRoleDto extends createZodDto(ResRoleSchema) { }
export class ResRolesDto extends createZodDto(ResRolesSchema) { }
export class RoleWithPermissionsDto extends createZodDto(RoleWithPermissionsSchema) { }