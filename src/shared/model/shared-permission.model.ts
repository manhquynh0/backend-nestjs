import { z } from "zod";
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