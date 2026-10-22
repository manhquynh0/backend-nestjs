import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { RolesService } from './roles.service.js'
import { TokenService } from '~/shared/services/token.service.js'
import { HashsingService } from '~/shared/services/hashsing.service.js'
import { isUniqueConstraintError, generateOTP } from '~/shared/helpers.js'
import { RegisterBodyType, SendOtpBodyType, LoginBodyType } from './auth.model.js'
import { AuthRepository } from './auth.repo.js'
import { SharedUserRepo } from "~/shared/reposistory/shared-user-repo.js"
import ms, { StringValue } from 'ms'
import envConfig from '~/shared/config.js'
import { addMilliseconds } from 'date-fns'
import { TypeOfVerificationCode } from "~/shared/constanst/auth.constant.js"
import { BrevoEmailService } from "~/shared/services/BrevoEmail.service.js"
import { AccessTokenPayLoadCreate } from '~/shared/types/token.type.js'
@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
        private readonly hashsingService: HashsingService,
        private readonly rolesService: RolesService,
        private readonly tokenService: TokenService,
        private readonly authRepository: AuthRepository,
        private readonly sharedUserRepo: SharedUserRepo,
        private readonly brevoEmailService: BrevoEmailService,
    ) { }

    async register(body: RegisterBodyType) {
        try {
            const vertificationCode = await this.authRepository.findUniqueVerificationCode({
                email: body.email,
                code: body.code,
                type: TypeOfVerificationCode.REGISTER
            })
            if (!vertificationCode || vertificationCode.expiresAt < new Date()) {
                throw new BadRequestException("Invalid verification code")
            }
            const clientRoleId = await this.rolesService.getClientRoleId()
            const hashPassword = await this.hashsingService.hash(body.password)
            const { confirmPassword, code, ...userData } = body
            const user = await this.authRepository.createUser({
                ...userData,
                password: hashPassword,
                roleId: clientRoleId as number
            })
            return user
        } catch (error) {
            if (isUniqueConstraintError(error)) {
                throw new ConflictException("User already exists")
            }
            throw error
        }

    }
    async sendOtp(body: SendOtpBodyType) {
        const { email, type } = body
        const user = await this.sharedUserRepo.findUniqueUser({ email })
        if (user) {
            throw new ConflictException("User already exists")
        }
        const code = generateOTP()
        const verificationCode = await this.authRepository.createVerificationCode({
            email,
            type,
            code,
            expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue))
        })
        await this.brevoEmailService.sendEmail({
            email,
            subject: 'Verification Code',
            html: `<h1>Your verification code is: ${code}</h1>`
        })
        return verificationCode

    }
    async login(body: LoginBodyType, clientInfo: { ip: string; userAgent: string }) {
        try {
            const { email, password } = body
            const user = await this.authRepository.findUniqueUserWithRole({ email })
            if (!user) {
                throw new BadRequestException("Invalid Email")
            }
            const isPasswordValid = await this.hashsingService.compare(password, user.password)
            if (!isPasswordValid) {
                throw new BadRequestException("Invalid Password")
            }
            const device = await this.authRepository.createDevice({
                userId: user.id,
                ip: clientInfo.ip,
                userAgent: clientInfo.userAgent
            })
            return this.generateTokens({
                userId: user.id,
                roleId: user.roleId,
                deviceId: device.id,
                roleName: user.role.name
            })
        } catch (error) {
            throw error
        }
    }
    async generateTokens(payload: AccessTokenPayLoadCreate) {
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken({
                userId: payload.userId,
                roleId: payload.roleId,
                roleName: payload.roleName,
                deviceId: payload.deviceId
            }),
            this.tokenService.signRefreshToken({
                userId: payload.userId
            })
        ])
        const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
        if (!decodedRefreshToken) {
            throw new BadRequestException("Invalid Refresh Token")
        }
        await this.authRepository.createRefreshToken({
            userId: decodedRefreshToken.userId,
            token: refreshToken,
            expiresAt: addMilliseconds(new Date(), ms(envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue)),
            deviceId: payload.deviceId as number
        })
        return { accessToken, refreshToken }
    }
}
