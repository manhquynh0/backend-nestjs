import { Module, Global } from '@nestjs/common';
import { PrismaService } from '~/shared/services/prisma.service.js'
import { HashsingService } from './services/hashsing.service.js';
@Global()
@Module({
    providers: [PrismaService, HashsingService],
    exports: [PrismaService, HashsingService]
})
export class SharedModule { }
