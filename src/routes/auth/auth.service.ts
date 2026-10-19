import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { RolesService } from './roles.service.js'
import { TokenService } from '~/shared/services/token.service.js'
import { HashsingService } from '~/shared/services/hashsing.service.js'
import { isUniqueConstraintError } from '~/shared/helpers.js'
import { RegisterBodyType } from './auth.model.js'
import { AuthRepository } from './auth.repo.js'
@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
        private readonly hashsingService: HashsingService,
        private readonly rolesService: RolesService,
        private readonly tokenService: TokenService,
        private readonly authRepository: AuthRepository
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
}
