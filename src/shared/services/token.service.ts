import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import envConfig from '~/shared/config.js'
import { AccessTokenPayLoadCreate, RefreshTokenPayLoadCreate } from '~/shared/types/token.type.js'
import { randomUUID } from 'crypto'
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) { }
  signAccessToken(payload: AccessTokenPayLoadCreate) {
    return this.jwtService.sign({ ...payload, uuid: randomUUID() }, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as any,
    })
  }
  signRefreshToken(payload: RefreshTokenPayLoadCreate) {
    return this.jwtService.sign({ ...payload, uuid: randomUUID() }, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as any,
    })
  }
  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    })
  }
  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    })
  }
}
