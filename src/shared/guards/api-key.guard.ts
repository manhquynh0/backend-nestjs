import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import config from '~/shared/config.js'
@Injectable()
export class APIKeyGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const xAPIKey = request.headers['x-api-key']
        if (xAPIKey !== config.SECRET_API_KEY) return false
        return true

    }
}
