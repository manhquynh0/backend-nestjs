// src/shared/exceptions/app.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common'
import { ErrorCodeType } from '~/shared/constanst/error.constant.js'

export class AppException extends HttpException {
    public readonly errorCode: ErrorCodeType
    public readonly details?: any

    constructor(params: {
        message: string
        statusCode?: HttpStatus
        errorCode: ErrorCodeType
        details?: any
    }) {
        super(
            {
                message: params.message,
                errorCode: params.errorCode,
                details: params.details,
            },
            params.statusCode ?? HttpStatus.BAD_REQUEST,
        )
        this.errorCode = params.errorCode
        this.details = params.details
    }
}
