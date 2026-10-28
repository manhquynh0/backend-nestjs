import { z } from "zod"

export const LanguageBodySchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict()
export const LanguageCreateBodySchema = LanguageBodySchema.pick({
    id: true,
    name: true,
    code: true,
}).strict()
export const LanguageUpdateBodySchema = LanguageBodySchema.pick({
    name: true,
    code: true,
}).partial().strict()
export const LanguageUpdateResBodySchema = LanguageBodySchema

export const GetLanguageResSchema = z.array(LanguageBodySchema)

export const GetLanguageParamsSchema = z.object({
    languageId: z.string().max(10)
}).strict()
export const GetLanguageDetailResSchema = LanguageBodySchema

export type GetLanguageResType = z.infer<typeof GetLanguageResSchema>
export type LanguageBodyType = z.infer<typeof LanguageBodySchema>
export type LanguageCreateBodyType = z.infer<typeof LanguageCreateBodySchema>
export type LanguageUpdateBodyType = z.infer<typeof LanguageUpdateBodySchema>
export type GetLanguageParamsType = z.infer<typeof GetLanguageParamsSchema>
export type GetLanguageDetailResType = z.infer<typeof GetLanguageDetailResSchema>
