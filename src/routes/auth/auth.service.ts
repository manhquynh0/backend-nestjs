import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { RolesService } from './roles.service.js'
import { TokenService } from '~/shared/services/token.service.js'
import { HashsingService } from '~/shared/services/hashsing.service.js'
import { isUniqueConstraintError } from '~/shared/helpers.js'
@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
        private readonly hashsingService: HashsingService,
        private readonly rolesService: RolesService,
        private readonly tokenService: TokenService
    ) { }

    async register(body: any) {
        try {
            const clientRoleId = await this.rolesService.getClientRoleId()
            const hashPasswortd = await this.hashsingService.hash(body.password)
            const user = await this.prismaService.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    password: hashPasswortd,
                    roleId: clientRoleId as number,
                    phoneNumber: body.phoneNumber,
                },
                omit: {
                    password: true,
                    totpSecret: true
                }
            })
            return {
                user,
            }
        } catch (error) {
            if (isUniqueConstraintError(error)) {
                throw new ConflictException("User already exists")
            }
            throw error
        }

    }
}
