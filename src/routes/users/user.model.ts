import { z } from "zod"
import { UserSchema } from '~/shared/model/shared-user-model.js'
import { RoleSchema } from '~/shared/model/shared-role.model.js'
export const UpdateUserSchema = UserSchema.pick({
    name: true,
    email: true,
    password: true,
    avatar: true,
    phoneNumber: true,
    status: true,
    roleId: true,
}).strict()
export const CreateUserSchema = UpdateUserSchema
export const GetParamsSchema = z.object({
    userId: z.coerce.number().int().positive()
}).strict()
export const GetQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
})
export const GetUserResSchema = z.object({
    data: z.array(
        UserSchema.omit({ password: true, totpSecret: true }).extend({
            role: RoleSchema.pick({
                id: true,
                name: true,
            })
        })
    ),
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
})
export const ResUsersSchema = UserSchema.omit({ password: true, totpSecret: true }).extend({
    role: RoleSchema.pick({
        id: true,
        name: true,
    })
})
export type GetQueryType = z.infer<typeof GetQuerySchema>
export type GetUserResType = z.infer<typeof GetUserResSchema>
export type CreateUserType = z.infer<typeof CreateUserSchema>
export type UpdateUserType = z.infer<typeof UpdateUserSchema>
export type GetParamsType = z.infer<typeof GetParamsSchema>
export type ResUsersType = z.infer<typeof ResUsersSchema>