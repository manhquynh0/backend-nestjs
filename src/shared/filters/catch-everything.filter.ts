
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { isUniqueConstraintError } from '../helpers.js';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        // In certain situations `httpAdapter` might not be available in the
        // constructor, so resolve it here.
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        console.error('DEBUG EXCEPTION:', exception);
        let httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        let message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error'

        if (isUniqueConstraintError(httpStatus)) {
            httpStatus = HttpStatus.CONFLICT,
                message = 'Record has already existed'
        }

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
