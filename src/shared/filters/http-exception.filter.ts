
import { Logger, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { ZodSerializationException } from 'nestjs-zod'

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name)

    catch(exception: HttpException, host: ArgumentsHost) {
        if (exception instanceof ZodSerializationException) {
            const zodError = exception.getZodError() as unknown;
            let errorMessage: string;
            if (zodError && typeof (zodError as any).message === 'string') {
                errorMessage = (zodError as any).message;
            } else if (zodError && typeof (zodError as any).errors === 'object') {
                errorMessage = JSON.stringify((zodError as any).errors);
            } else {
                errorMessage = 'Unknown Zod error';
            }
            this.logger.error(`ZodSerializationException: ${errorMessage}`);
        }

        super.catch(exception, host)
    }
}
