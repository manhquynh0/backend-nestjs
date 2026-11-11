import { Module, Global } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { HashingService } from '~/shared/services/hashing.service.js'
import { TokenService } from '~/shared/services/token.service.js'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from './guards/access-token.guard.js'
import { APIKeyGuard } from './guards/api-key.guard.js'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticationGuard } from './guards/authentication.guard.js'
import { SharedUserRepo } from './reposistory/shared-user-repo.js'
import { BrevoEmailService } from './services/BrevoEmail.service.js'
import { TwoFactorAuthService } from './services/2fa.service.js'
import { PermissionGuard } from './guards/permission.guard.js'
import { RolesRepository } from './reposistory/shared-get-role.js'
const shareService = [
  PrismaService,
  HashingService,
  TokenService,
  SharedUserRepo,
  BrevoEmailService,
  TwoFactorAuthService,
  RolesRepository
]
@Global()
@Module({
  providers: [
    ...shareService,
    AccessTokenGuard,
    APIKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: shareService,
  imports: [JwtModule],
})
export class SharedModule { }
