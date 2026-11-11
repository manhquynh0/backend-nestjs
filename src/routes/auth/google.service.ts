import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import envConfig from '~/shared/config.js'
import { GoogleBodyType } from './auth.model.js'
import { AuthRepository } from './auth.repo.js'
import { AuthService } from './auth.service.js'
import { HashingService } from '~/shared/services/hashing.service.js'
import { randomUUID } from 'crypto'
import { roleName } from '~/shared/constants/role.constant.js'
import { RolesRepository } from '~/shared/reposistory/shared-get-role.js'
@Injectable()
export class GoogleService {
  private readonly oauth2Client = new OAuth2Client(
    envConfig.GOOGLE_CLIENT_ID,
    envConfig.GOOGLE_CLIENT_SECRET,
    envConfig.GOOGLE_CALLBACK,
  )
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashsingService: HashingService,
    private readonly authService: AuthService,
    private readonly rolesRepository: RolesRepository
  ) { }
  getAuthorizationUrl({ userAgent, ip }: GoogleBodyType) {
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ]
    const stateString = Buffer.from(
      JSON.stringify({
        userAgent,
        ip,
      }),
    ).toString('base64')
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      state: stateString,
      prompt: 'consent',
    })
    return { url }
  }
  async googleCallback({ code, state }: { code: string; state: string }) {
    let userAgent = 'Unknown'
    let ip = 'Unknown'
    // 1. Lấy state từ Url

    try {
      if (state) {
        const clientInfo = JSON.parse(Buffer.from(state, 'base64').toString())
        userAgent = clientInfo.userAgent
        ip = clientInfo.ip
      }
    } catch (error) {
      console.error('Error parsing state', error)
    }

    // 2. Trao đổi authorization code để lấy token
    let tokens
    try {
      const response = await this.oauth2Client.getToken(code)
      tokens = response.tokens
    } catch (error: any) {
      throw new UnauthorizedException('Invalid or expired Google authorization code')
    }
    if (!tokens.id_token) {
      throw new UnauthorizedException('Google ID Token not provided')
    }
    // 3. Xác thực an toàn ID Token (tránh race condition trên singleton oauth2Client)
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: envConfig.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      throw new BadRequestException("Cannot retrieve user's email from Google")
    }
    // 4. Tìm hoặc tạo mới người dùng
    let user = await this.authRepository.findUniqueUserWithRole({
      email: payload.email,
    })
    if (!user) {
      const userRoleId = await this.rolesRepository.getRoleId(roleName.User)
      const password = randomUUID()
      const hashPassword = await this.hashsingService.hash(password)

      await this.authRepository.createUser({
        email: payload.email,
        name: payload.name ?? 'Google User',
        password: hashPassword,
        phoneNumber: '',
        roleId: userRoleId as number,
        avatar: payload.picture ?? null,
      })
      user = await this.authRepository.findUniqueUserWithRole({
        email: payload.email,
      })
    }
    return await this.authService.handleDeviceSession(user!, { ip, userAgent })
  }
}
