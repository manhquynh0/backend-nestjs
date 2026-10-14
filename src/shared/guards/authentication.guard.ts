import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator.js'
import { AccessTokenGuard } from './access-tokem.guard.js'
import { APIKeyGuard } from './api-key.guard.js'
import { AuthType } from '../constanst/auth.constant.js'
import { ConditionGuard } from '../constanst/auth.constant.js'
@Injectable()
export class AuthenticationGuard implements CanActivate {
    private readonly authTypeGuardMap: Record<string, CanActivate>

    constructor(
        private readonly reflector: Reflector,
        private readonly accessTokenGuard: AccessTokenGuard,
        private readonly apiKeyGuard: APIKeyGuard
    ) {
        this.authTypeGuardMap = {
            [AuthType.Bearer]: this.accessTokenGuard,
            [AuthType.ApiKey]: this.apiKeyGuard,
            [AuthType.None]: { canActivate: () => true }
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authTypeValue = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? { authTypes: [AuthType.None], options: { condition: ConditionGuard.Or } }

        const guards = authTypeValue.authTypes.map((authType: AuthType) => this.authTypeGuardMap[authType])

        if (authTypeValue.options.condition === ConditionGuard.And) {
            // AND: Bắt buộc TẤT CẢ guard đều phải thành công
            for (const instance of guards) {
                try {
                    const canActive = await instance.canActivate(context)
                    if (!canActive) throw new UnauthorizedException()
                } catch {
                    throw new UnauthorizedException()
                }
            }
            return true
        } else {
            // OR: Chỉ cần 1 guard thành công là được qua
            let lastError: any = null
            for (const instance of guards) {
                try {
                    const canActive = await instance.canActivate(context)
                    if (canActive) return true
                } catch (error) {
                    lastError = error
                }
            }
            throw lastError ?? new UnauthorizedException()
        }
    }
}
