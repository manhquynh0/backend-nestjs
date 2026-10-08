import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import envConfig from "~/shared/config.js";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }
    signAccessToken(payload: { userId: number }) {
        return this.jwtService.sign(payload, {
            secret: envConfig.ACCESS_TOKEN_SECRET,
            expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as any
        })
    }
    signRefreshToken(payload: { userId: number }) {
        return this.jwtService.sign(payload, {
            secret: envConfig.REFRESH_TOKEN_SECRET,
            expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as any
        })
    }
    verifyAccessToken(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: envConfig.ACCESS_TOKEN_SECRET
        })
    }
    verifyRefreshToken(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: envConfig.REFRESH_TOKEN_SECRET
        })
    }
}