import { Module, Global } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { HashsingService } from './services/hashsing.service.js'
import { TokenService } from '~/shared/services/token.service.js'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from './guards/access-token.guard.js'
import { APIKeyGuard } from './guards/api-key.guard.js'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticationGuard } from './guards/authentication.guard.js'
import { SharedUserRepo } from './reposistory/shared-user-repo.js'
import { BrevoEmailService } from './services/BrevoEmail.service.js'
import { TwoFactorAuthService } from './services/2fa.service.js'
const shareService = [PrismaService, HashsingService, TokenService, SharedUserRepo, BrevoEmailService, TwoFactorAuthService]
@Global()
@Module({
  providers: [...shareService, AccessTokenGuard, APIKeyGuard, {
    provide: APP_GUARD,
    useClass: AuthenticationGuard
  }],
  exports: shareService,
  imports: [JwtModule],
})
export class SharedModule { }
