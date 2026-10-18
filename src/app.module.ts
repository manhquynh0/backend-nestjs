import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { SharedModule } from './shared/shared.module.js'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AuthModule } from './routes/auth/auth.module.js'
import { APP_PIPE } from '@nestjs/core'
import { ZodSerializationException, ZodValidationPipe } from 'nestjs-zod'
import { CustomZodValidationPipe } from './shared/pipes/custom-zod-validtion.pipe.js'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializationException
    }
  ],
})
export class AppModule { }
