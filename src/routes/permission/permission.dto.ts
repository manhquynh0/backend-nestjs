import { createZodDto } from "nestjs-zod"
import {
    CreatePermissionSchema,
    UpdatePermissionSchema,
    GetPermissionParamsSchema,
    GetPermissionsParamsSchema,
    GetPermissionsResSchema,
    ResPermissionSchema
} from "./permission.model.js"

export class CreatePermissionDto extends createZodDto(CreatePermissionSchema) { }
export class UpdatePermissionDto extends createZodDto(UpdatePermissionSchema) { }
export class GetPermissionParamsDto extends createZodDto(GetPermissionParamsSchema) { }
export class GetPermissionsParamsDto extends createZodDto(GetPermissionsParamsSchema) { }
export class GetPermissionsResDto extends createZodDto(GetPermissionsResSchema) { }
export class ResPermissionDto extends createZodDto(ResPermissionSchema) { }