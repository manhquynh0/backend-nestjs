import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { SharedModule } from './shared/shared.module.js'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { AuthModule } from './routes/auth/auth.module.js'
import { APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { CustomZodValidationPipe } from './shared/pipes/custom-zod-validtion.pipe.js'
import { CatchEverythingFilter } from './shared/filters/catch-everything.filter.js'
import { LanguageModule } from './routes/language/language.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    AuthModule,
    LanguageModule,
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
      useClass: ZodSerializerInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter
    }
  ],
})
export class AppModule { }
