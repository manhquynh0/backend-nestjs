import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { HashsingService } from '~/shared/services/hashsing.service.js'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { Prisma } from '~/generated/prisma/client.js'
import { TokenService } from '~/shared/services/token.service.js'
import envConfig from '~/shared/config.js'
@Injectable()
export class AuthService {
    constructor(
        private readonly hashingService: HashsingService,
        private readonly prismaService: PrismaService,
        private readonly tokenService: TokenService
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
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Email already exists')
            }
            throw error
        }
    }
    async login(body: any) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email
            }
        })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        const isPasswordValid = await this.hashingService.compare(body.password, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password')
        }
        const { accessToken, refreshToken } = await this.generateTokens({ userId: user.id })
        const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
        await this.prismaService.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(decodedRefreshToken.exp * 1000)
            }
        })
        return { accessToken, refreshToken }
    }
    async generateTokens(payload: { userId: number }) {
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken(payload),
            this.tokenService.signRefreshToken(payload)
        ])
        return { accessToken, refreshToken }
    }
    async refreshToken(refreshToken: string) {
        const tokenInDb = await this.prismaService.refreshToken.findUnique({
            where: { token: refreshToken }
        })
        if (!tokenInDb) {
            throw new UnauthorizedException('Refresh token is invalid or has been revoked')
        }
        const decodedToken = await this.tokenService.verifyRefreshToken(refreshToken)
        const user = await this.prismaService.user.findUniqueOrThrow({
            where: { id: decodedToken.userId }
        })
        const accessToken = await this.tokenService.signAccessToken({ userId: user.id })
        return { accessToken }
    }


    async logout(id: number) {
        const user = await this.prismaService.user.findFirst({
            where: {
                id: id
            }
        })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        await this.prismaService.refreshToken.deleteMany({
            where: {
                userId: user.id
            }
        })
    }
}
