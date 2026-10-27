
import { z } from "zod"
import { TypeOfVerificationCode } from "~/shared/constanst/auth.constant.js"
import { UserSchema } from "~/shared/model/shared-user-model.js"


export const RegisterBodySchema = UserSchema.pick({
    email: true,
    password: true,
    name: true,
    phoneNumber: true,
}).extend({
    confirmPassword: z.string().min(8).max(100),
    code: z.string().length(6)
}).strict().superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
        })
    }
})

export const RegisterResSchema = UserSchema.omit({
    password: true,
    totpSecret: true
})
export const VerificationCode = z.object({
    id: z.number(),
    email: z.string().email(),
    code: z.string().length(6),
    type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
    expiresAt: z.date(),
    createdAt: z.date(),
})

export const SendOtpBodySchema = VerificationCode.pick({
    email: true,
    type: true
}).strict()

export const LoginBodySchema = UserSchema.pick({
    email: true,
    password: true
}).strict()

export const LoginResSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
}).strict()

export const RefreshTokenBodySchema = z.object({
    refreshToken: z.string()
}).strict()

export const RefreshTokenResSchema = LoginResSchema
export const RefreshTokenSchema = z.object({
    token: z.string(),
    userId: z.number(),
    deviceId: z.number().nullable(),
    expiresAt: z.date(),
    createdAt: z.date()
})

export const DeviceModel = z.object({
    id: z.number(),
    userId: z.number(),
    createdAt: z.date(),
    ip: z.string(),
    lastActive: z.date(),
    userAgent: z.string(),
    isActive: z.boolean()
})

export const RoleSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
})
export const LogoutBodySchema = RefreshTokenBodySchema
export const GoogleBodySchema = DeviceModel.pick({
    userAgent: true,
    ip: true
})
export const GetAuthorizationUrlResSchema = z.object({
    url: z.string()
}).strict()

export const ForgotPasswordBodySchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
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
export type RegisterResType = z.infer<typeof RegisterResSchema>
export type SendOtpBodyType = z.infer<typeof SendOtpBodySchema>
export type VerificationCodeType = z.infer<typeof VerificationCode>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type LoginResType = z.infer<typeof LoginResSchema>
export type RefreshTokenSchemaType = z.infer<typeof RefreshTokenSchema>
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>
export type RefreshTokenResType = z.infer<typeof RefreshTokenResSchema>
export type DeviceType = z.infer<typeof DeviceModel>
export type RoleType = z.infer<typeof RoleSchema>
export type LogoutBodyType = z.infer<typeof LogoutBodySchema>
export type GoogleBodyType = z.infer<typeof GoogleBodySchema>
export type GetAuthorizationUrlResType = z.infer<typeof GetAuthorizationUrlResSchema>
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>