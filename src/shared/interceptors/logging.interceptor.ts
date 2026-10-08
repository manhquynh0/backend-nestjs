
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...'); // sẽ được log khi request được gửi đến server
        return next.handle().pipe(map((data) => {
            const ctx = context.switchToHttp()
            const response = ctx.getResponse()
            const request = ctx.getRequest()
            console.log('After...'); // sẽ được log khi request được trả về server
            console.log(request.method, request.url, response.statusCode);
            return {
                data,
                status: response.statusCode
            }
        }))
    }
}
