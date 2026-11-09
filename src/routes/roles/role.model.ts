import z from "zod";

export const RoleSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),

    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),

    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})
export const RoleWithPermissionsSchema = RoleSchema.extend({
    permissions: z.array(z.number()),
})
export const CreateRoleSchema = RoleSchema.pick({
    name: true,
    description: true,
    isActive: true
})
export const UpdateRoleSchema = CreateRoleSchema.extend({
    permissions: z.array(z.number()).optional(),
}).partial()
export const GetRoleParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
})
export const GetRolesParamsSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
})
export const ResRolesSchema = z.object({
    data: z.array(RoleWithPermissionsSchema),
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
    }),
})
export const ResRoleSchema = RoleSchema
export type RoleType = z.infer<typeof RoleSchema>
export type CreateRoleType = z.infer<typeof CreateRoleSchema>
export type UpdateRoleType = z.infer<typeof UpdateRoleSchema>
export type GetRoleParamsType = z.infer<typeof GetRoleParamsSchema>
export type GetRolesParamsType = z.infer<typeof GetRolesParamsSchema>
export type ResRoleType = z.infer<typeof ResRoleSchema>
export type ResRolesType = z.infer<typeof ResRolesSchema>