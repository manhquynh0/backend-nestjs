import { z } from 'zod'
import { UserActive } from '~/shared/constants/auth.constant.js'

export const PermissionInProfileSchema = z.object({
    id: z.number(),
    name: z.string(),
    path: z.string(),
    method: z.string(),
})

export const RoleInProfileSchema = z.object({
    id: z.number(),
    name: z.string(),
    permissions: z.array(PermissionInProfileSchema),
})

export const ProfileSchema = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string().min(3).max(100),
    password: z.string().min(3).max(100),
    phoneNumber: z.string(),
    avatar: z.string().nullable(),
    status: z.enum([UserActive.ACTIVE, UserActive.INACTIVE, UserActive.BLOCKED]),
    createdAt: z.date().nullable(),
    createdById: z.number().nullable(),
    roleId: z.number(),
    updatedAt: z.date().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),

})

export const UpdateProfileSchema = ProfileSchema.pick({
    name: true,
    phoneNumber: true,
    avatar: true,
}).partial()

export const ResProfileSchema = ProfileSchema.pick({
    id: true,
    email: true,
    name: true,
    phoneNumber: true,
    avatar: true,
    status: true,
    updatedById: true
}).extend({
    role: RoleInProfileSchema,
})

export const ChangePassWordSchema = z.object({
    oldPassword: z.string().min(3).max(100),
    newPassword: z.string().min(3).max(100),
}).superRefine(({ oldPassword, newPassword }, ctx) => {
    if (oldPassword == newPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Mật khẩu cũ và mật khẩu mới không được giống nhau',
            path: ['newPassword'],
        })
    }
})

export const ResponseUpdateSchema = UpdateProfileSchema
export const ResponseChangePassWordSchema = ChangePassWordSchema
export type ProfileType = z.infer<typeof ProfileSchema>
export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>
export type ChangePassWordType = z.infer<typeof ChangePassWordSchema>
export type ResponseUpdateType = z.infer<typeof ResponseUpdateSchema>
export type ResponseChangePassWordType = z.infer<typeof ResponseChangePassWordSchema>
export type ResProfileType = z.infer<typeof ResProfileSchema>