import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AccessTokenPayload } from '~/shared/types/token.type.js'
import { REQUEST_USER_KEY } from '../constanst/auth.constant.js'

export const ActiveUser = createParamDecorator((field: keyof AccessTokenPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user: AccessTokenPayload | undefined = request[REQUEST_USER_KEY]
  return field ? user?.[field] : user
})

export type { AccessTokenPayload }