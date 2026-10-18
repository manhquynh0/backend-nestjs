
import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe } from 'nestjs-zod'

export const CustomZodValidationPipe: ReturnType<typeof createZodValidationPipe> =
    createZodValidationPipe({
        createValidationException: (error: any) => {
            return new UnprocessableEntityException({
                message: 'Validation failed',
                errors: error.issues.map((issue: any) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            })
        },
    })
