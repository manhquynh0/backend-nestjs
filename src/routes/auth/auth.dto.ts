import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { UserStatus } from '~/generated/prisma/client.js'

const UserSchema = z.object({
    id: z.number(),
    name: z.string().min(3).max(50),
    email: z.string().email(),
    avatar: z.string().nullable(),
    phoneNumber: z.string(),
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.INACTIVE]).default(UserStatus.INACTIVE),
    createdAt: z.date(),
    updatedAt: z.date(),
    roleId: z.number(),
    createById: z.number().nullable(),
    updateById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    deletedById: z.number().nullable(),
})
const registerSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
    phoneNumber: z.string().length(10),
}).strict().superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
        })
    }
})

export class RegisterDTO extends createZodDto(registerSchema) { }
export class RegisterResDTO extends createZodDto(UserSchema) { }