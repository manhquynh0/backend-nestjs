import { BadRequestException, ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { RolesService } from './roles.service.js'
import { TokenService } from '~/shared/services/token.service.js'
import { HashsingService } from '~/shared/services/hashsing.service.js'
import { isUniqueConstraintError, generateOTP } from '~/shared/helpers.js'
import { RegisterBodyType, SendOtpBodyType, LoginBodyType, RefreshTokenBodyType, LogoutBodyType } from './auth.model.js'
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
                roleId: clientRoleId as number,
                avatar: null
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
            return this.handleDeviceSession(user, clientInfo)
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
    async refreshToken(body: RefreshTokenBodyType, clientInfo: { ip: string; userAgent: string }) {
        try {
            // 1. Xác thực Refresh Token do client gửi lên
            // Nếu token sai chữ ký hoặc hết hạn, jwtService sẽ throw lỗi và nhảy vào khối catch
            const { userId } = await this.tokenService.verifyRefreshToken(body.refreshToken)

            // 2. Tìm token này trong database
            // Mục đích: Kiểm tra xem token này còn tồn tại hay đã bị xóa/thu hồi trước đó
            const refreshTokenIndb = await this.authRepository.findUniqueRefreshToken({
                token: body.refreshToken
            })

            // 3. Nếu không tìm thấy trong database:
            // Nghĩa là token này đã được sử dụng rồi (đã bị xóa ở lần refresh trước)
            // hoặc đã bị admin thu hồi -> chặn lại ngay (Cơ chế Reuse Detection)
            if (!refreshTokenIndb) {
                throw new UnauthorizedException("RefreshToken has been used")
            }

            // Kiểm tra xem token trong database đã quá hạn chưa
            if (refreshTokenIndb.expiresAt < new Date()) {
                await this.authRepository.deleteRefreshToken(body.refreshToken)
                throw new UnauthorizedException("Refresh token has expired")
            }

            // 4. Lấy thông tin cần thiết từ record trong DB
            const { deviceId, user: { roleId, name: roleName } } = refreshTokenIndb

            // 5. Chuẩn bị Promise cập nhật thông tin thiết bị (IP, User-Agent mới nhất)
            const $updateDevice = this.authRepository.updateDevice(deviceId as number, {
                userId: userId,
                ip: clientInfo.ip,
                userAgent: clientInfo.userAgent,
            })

            // 6. Chuẩn bị Promise xóa Refresh Token cũ (Refresh Token Rotation)
            const $deleteRefreshToken = this.authRepository.deleteRefreshToken(body.refreshToken)

            // 7. Tạo cặp Token mới (AccessToken và RefreshToken mới)
            const $tokens = this.generateTokens({
                userId,
                roleId,
                roleName,
                deviceId: deviceId ?? undefined
            })

            // 8. Chạy song song cả 3 tác vụ bất đồng bộ để tối ưu hiệu năng (Performance)
            const [_, __, tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens])

            // 9. Trả về cặp token mới { accessToken, refreshToken } cho client
            return tokens

        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            if (error?.name === 'TokenExpiredError') {
                throw new UnauthorizedException("Refresh token has expired")
            }
            if (error?.name === 'JsonWebTokenError') {
                throw new UnauthorizedException("Invalid refresh token")
            }
            throw error
        }
    }
    async logout(body: LogoutBodyType) {
        try {
            await this.authRepository.deleteRefreshToken(body.refreshToken)
            return { message: "Logout successfully" }
        } catch (error: any) {
            // Mã P2025: Bản ghi không tồn tại trong DB (đã bị xóa trước đó) -> Vẫn coi là logout thành công
            if (error.code === 'P2025') {
                return { message: "Logout successfully" }
            }
            if (error instanceof HttpException) {
                throw error
            }
            throw error
        }
    }

    async handleDeviceSession(user: { id: number; roleId: number; role: { name: string } }, clientInfo: { ip: string; userAgent: string }) {
        let device = await this.authRepository.findDevice({
            userId: user.id,
            ip: clientInfo.ip,
            userAgent: clientInfo.userAgent
        })

        if (!device) {
            device = await this.authRepository.createDevice({
                userId: user.id,
                ip: clientInfo.ip,
                userAgent: clientInfo.userAgent,
            })
        } else {
            device = await this.authRepository.updateDevice(device.id, {
                userId: user.id,
                ip: clientInfo.ip,
                userAgent: clientInfo.userAgent
            })
        }

        // Xóa tất cả RefreshToken cũ của thiết bị
        await this.authRepository.deleteRefreshTokensByDeviceId(device.id)

        return this.generateTokens({
            userId: user.id,
            roleId: user.roleId,
            deviceId: device.id,
            roleName: user.role.name
        })
    }


}
