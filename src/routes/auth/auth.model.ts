
import { z } from "zod"
import { TypeOfVerificationCode } from "~/shared/constanst/auth.constant.js"
import { UserSchema } from "~/shared/model/shared-user-model.js"


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
export const VerificationCode = z.object({
    id: z.number(),
    email: z.string().email(),
    code: z.string().length(6),
    type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
    expiresAt: z.date(),
    createdAt: z.date(),
})
export type VerificationCodeType = z.infer<typeof VerificationCode>
export const SendOtpBodySchema = VerificationCode.pick({
    email: true,
    type: true
}).strict()
export type SendOtpBodyType = z.infer<typeof SendOtpBodySchema>