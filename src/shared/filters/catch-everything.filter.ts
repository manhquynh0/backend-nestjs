
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { isUniqueConstraintError, isNotFoundError } from '../helpers.js'
import { ErrorCode } from '../constanst/error.constant.js'
import { AppException } from '../exceptions/app.exception.js'

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
    private readonly logger = new Logger(CatchEverythingFilter.name)

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost
        const ctx = host.switchToHttp()
        const request = ctx.getRequest()

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        let errorCode: string = ErrorCode.INTERNAL_SERVER_ERROR
        let message: string = 'Đã có lỗi xảy ra từ máy chủ'
        let errors: any = null

        // 1. Nếu là AppException (lỗi custom nghiệp vụ)
        if (exception instanceof AppException) {
            statusCode = exception.getStatus()
            errorCode = exception.errorCode
            message = exception.message
            errors = exception.details ?? null
        }
        // 2. Nếu là HttpException mặc định của NestJS (VD: BadRequestException, UnauthorizedException)
        else if (exception instanceof HttpException) {
            statusCode = exception.getStatus()
            const res = exception.getResponse() as any
            message = typeof res === 'string' ? res : res.message || message
            errors = res.errors || null
            errorCode = res.errorCode || `HTTP_${statusCode}`
        }
        // 3. Xử lý lỗi Database từ Prisma tập trung
        else if (isUniqueConstraintError(exception)) {
            statusCode = HttpStatus.CONFLICT
            errorCode = ErrorCode.USER_ALREADY_EXISTS
            message = 'Bản ghi này đã tồn tại trong hệ thống'
        } else if (isNotFoundError(exception)) {
            statusCode = HttpStatus.NOT_FOUND
            errorCode = ErrorCode.RECORD_NOT_FOUND
            message = 'Không tìm thấy dữ liệu yêu cầu'
        } else {
            // 4. Lỗi 500 không xác định -> Ghi log ra terminal để debug
            this.logger.error(`[Unhandled Error] ${httpAdapter.getRequestUrl(request)}`, exception)
        }

        const isDev = process.env.NODE_ENV !== 'production'

        const responseBody = {
            statusCode,
            errorCode,
            message,
            errors,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(request),
            ...(isDev && exception instanceof Error ? { stack: exception.stack } : {}),
        }

        httpAdapter.reply(ctx.getResponse(), responseBody, statusCode)
    }
}
