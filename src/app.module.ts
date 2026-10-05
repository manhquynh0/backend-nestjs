import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { PostsModule } from './routes/posts/posts.module.js'
import { SharedModule } from './shared/shared.module.js'
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PostsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
