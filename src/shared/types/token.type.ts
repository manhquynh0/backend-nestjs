
export interface AccessTokenPayLoadCreate {
  userId: number
  roleId: number
  roleName: string
  deviceId?: number
}
export interface RefreshTokenPayLoadCreate {
  userId: number
}
export interface AccessTokenPayload extends AccessTokenPayLoadCreate {
  iat: number
  exp: number
}
export interface RefreshTokenPayload extends RefreshTokenPayLoadCreate {
  iat: number
  exp: number
}