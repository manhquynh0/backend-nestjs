import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '~/generated/prisma/client.js'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService?: ConfigService) {
    const connectionString = configService?.get<string>('DATABASE_URL') ?? process.env.DATABASE_URL!
    const adapter = new PrismaPg({
      connectionString,
    })
    super({
      adapter,
      log: ['info', 'query'],
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
