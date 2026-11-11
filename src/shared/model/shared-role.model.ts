import { z } from "zod";
import { Permission } from "./shared-permission.model.js";
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
    permissions: z.array(Permission)
})
export type RolePermissionType = z.infer<typeof RoleWithPermissionsSchema>