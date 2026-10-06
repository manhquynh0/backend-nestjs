import { Injectable } from '@nestjs/common'
import { HashsingService } from '~/shared/services/hashsing.service.js'
import { PrismaService } from '~/shared/services/prisma.service.js'

@Injectable()
export class AuthService {
    constructor(
        private readonly hashingService: HashsingService,
        private readonly prismaService: PrismaService
    ) { }
    async register(body: any) {
        try {
            const hashPassWord = await this.hashingService.hash(body.password)
            const user = await this.prismaService.user.create({
                data: {
                    email: body.email,
                    name: body.name,
                    password: hashPassWord
                }
            })
            return user
        }
        catch (error) {
            throw error
        }
    }
}
