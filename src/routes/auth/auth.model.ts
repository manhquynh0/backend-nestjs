
import { z } from "zod"
import { UserActive } from "~/shared/constanst/auth.constant.js"

export const UserSchema = z.object({
    id: z.number(),
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    totpSecret: z.string().nullable(),
    avatar: z.string().nullable(),
    phoneNumber: z.string(),
    status: z.enum([UserActive.ACTIVE, UserActive.INACTIVE, UserActive.BLOCKED]),
    createdAt: z.date(),
    updatedAt: z.date(),
    roleId: z.number(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
})
export type UserType = z.infer<typeof UserSchema>
export const RegisterBodySchema = UserSchema.pick({
    email: true,
    password: true,
    name: true,
    phoneNumber: true,
}).extend({
    confirmPassword: z.string().min(8).max(100)
}).strict().superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
        })
    }
})
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export const RegisterResSchema = UserSchema.omit({
    password: true,
    totpSecret: true
})