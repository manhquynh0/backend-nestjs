import { Module, Global } from '@nestjs/common';
import { PrismaService } from '~/shared/services/prisma.service.js'
import { HashsingService } from './services/hashsing.service.js';
import { TokenService } from '~/shared/services/token.service.js'
import { JwtModule } from '@nestjs/jwt'
const shareService = [PrismaService, HashsingService, TokenService]
@Global()
@Module({
    providers: shareService,
    exports: shareService,
    imports: [JwtModule]
})
export class SharedModule { }
