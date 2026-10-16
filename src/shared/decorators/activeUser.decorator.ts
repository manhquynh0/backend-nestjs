import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TokenPayload } from '~/shared/types/token.type.js'
import { REQUEST_USER_KEY } from '../constanst/auth.constant.js'

export const ActiveUser = createParamDecorator((field: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user: TokenPayload | undefined = request[REQUEST_USER_KEY]
  return field ? user?.[field] : user
})

export type { TokenPayload }