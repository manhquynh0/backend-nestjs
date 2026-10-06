import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { PostsModule } from './routes/posts/posts.module.js'
import { SharedModule } from './shared/shared.module.js'
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './routes/auth/auth.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PostsModule,
    SharedModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
