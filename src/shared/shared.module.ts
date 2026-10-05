import { Module, Global } from '@nestjs/common';
import { PrismaService } from '~/shared/services/prisma.service.js'
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService]
})
export class SharedModule { }
