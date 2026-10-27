import z from "zod";

export const EmptyBodySchema = z.object({}).optional().default({})


export type EmptyBodyType = z.infer<typeof EmptyBodySchema>
