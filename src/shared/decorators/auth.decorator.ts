import { SetMetadata } from "@nestjs/common";
import { AuthType, ConditionGuard } from "../constanst/auth.constant.js";


export const AUTH_TYPE_KEY = 'autotype'
export const Auth = (authTypes: AuthType[], options: { condition?: ConditionGuard }) => {
    return SetMetadata(AUTH_TYPE_KEY, { authTypes, options })

}
export const IsPublic = () => Auth([AuthType.None], { condition: ConditionGuard.And })