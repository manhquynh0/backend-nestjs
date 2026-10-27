
import { z } from 'zod'

export const ErrorResponseSchema = z.object({
    statusCode: z.number(),
    errorCode: z.string(),
    message: z.string(),
    errors: z.any().optional(), // Chi tiết lỗi validation (nếu có)
    timestamp: z.string(),
    path: z.string(),
    stack: z.string().optional(), // Chỉ xuất hiện ở dev
})

export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>
