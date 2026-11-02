import { z } from 'zod'
import { PER_METHOD } from '~/shared/constants/permission.constant.js'
export const Permission = z.object({
    id: z.number(),
    name: z.string().trim().min(1).max(100),
    description: z.string().max(255),
    path: z.string().trim().min(1).max(255).startsWith('/'),
    method: z.enum(PER_METHOD),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const CreatePermissionSchema = Permission.pick({
    name: true,
    path: true,
    method: true,
}).extend({
    description: z.string().max(255).optional(),
}).strict()

export const UpdatePermissionSchema = CreatePermissionSchema.partial().strict()
export const GetPermissionParamsSchema = z.object({
    permissionId: z.coerce.number().int().positive()
}).strict()
export const GetPermissionsParamsSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
}).strict()

export const ResPermissionSchema = Permission
export const GetPermissionsResSchema = z.object({
    data: z.array(Permission),
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number()
    }),
})

export type PermissionType = z.infer<typeof Permission>
export type CreatePermissionBodyType = z.infer<typeof CreatePermissionSchema>
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionSchema>
export type GetPermissionParamsType = z.infer<typeof GetPermissionParamsSchema>
export type GetPermissionsParamsType = z.infer<typeof GetPermissionsParamsSchema>
export type GetPermissionsResType = z.infer<typeof GetPermissionsResSchema>
export type ResPermissionType = z.infer<typeof ResPermissionSchema>