import { Module, Global } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
import { HashsingService } from './services/hashsing.service.js'
import { TokenService } from '~/shared/services/token.service.js'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from './guards/access-tokem.guard.js'
import { APIKeyGuard } from './guards/api-key.guard.js'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticationGuard } from './guards/authentication.guard.js'
const shareService = [PrismaService, HashsingService, TokenService,]
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
