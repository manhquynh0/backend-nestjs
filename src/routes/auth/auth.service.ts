import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { RolesService } from './roles.service.js'
import { TokenService } from '~/shared/services/token.service.js'
import { HashsingService } from '~/shared/services/hashsing.service.js'
import { isUniqueConstraintError, generateOTP } from '~/shared/helpers.js'
import { RegisterBodyType, SendOtpBodyType } from './auth.model.js'
import { AuthRepository } from './auth.repo.js'
import { SharedUserRepo } from "~/shared/reposistory/shared-user-repo.js"
import ms, { StringValue } from 'ms'
import envConfig from '~/shared/config.js'
import { addMilliseconds } from 'date-fns'
@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
        private readonly hashsingService: HashsingService,
        private readonly rolesService: RolesService,
        private readonly tokenService: TokenService,
        private readonly authRepository: AuthRepository,
        private readonly sharedUserRepo: SharedUserRepo,
    ) { }

    async register(body: RegisterBodyType) {
        try {
            const clientRoleId = await this.rolesService.getClientRoleId()
            const hashPassword = await this.hashsingService.hash(body.password)
            const { confirmPassword, ...userData } = body
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
        return verificationCode

    }
}
