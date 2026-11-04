import { HttpStatus } from '@nestjs/common'
import { AppException } from '~/shared/exceptions/app.exception.js'
import { ErrorCode } from '~/shared/constants/error.constant.js'

export const RoleNotFoundException = () =>
  new AppException({
    message: 'Role không tồn tại',
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: ErrorCode.RECORD_NOT_FOUND,
  })

export const RoleAlreadyExistsException = (name?: string) =>
  new AppException({
    message: name ? `Role '${name}' đã tồn tại trong hệ thống` : 'Role đã tồn tại trong hệ thống',
    statusCode: HttpStatus.CONFLICT,
    errorCode: ErrorCode.VALIDATION_ERROR,
    details: [{ field: 'name', message: 'Tên role đã tồn tại' }],
  })
