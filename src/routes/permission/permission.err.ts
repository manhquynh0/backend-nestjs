import { HttpStatus } from '@nestjs/common'
import { AppException } from '~/shared/exceptions/app.exception.js'
import { ErrorCode } from '~/shared/constants/error.constant.js'

export const PermissionNotFoundException = () =>
    new AppException({
        message: 'Permission không tồn tại',
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: ErrorCode.RECORD_NOT_FOUND,
    })

export const PermissionAlreadyExistsException = () =>
    new AppException({
        message: 'Permission với path và method này đã tồn tại',
        statusCode: HttpStatus.CONFLICT,
        errorCode: ErrorCode.VALIDATION_ERROR,
        details: [{ field: 'path', message: 'Đã tồn tại' }, { field: 'method', message: 'Đã tồn tại' }],
    })
