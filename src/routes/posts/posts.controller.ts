import { Body, Controller, Get, Post, Param, Put, UseGuards } from '@nestjs/common'
import { PostsService } from './posts.service.js'
import { AccessTokenGuard } from '~/shared/guards/access-tokem.guard.js'
import { APIKeyGuard } from '~/shared/guards/api-key.guard.js'
import { Auth } from '~/shared/decorators/auth.decorator.js'
import { AuthType, ConditionGuard } from '~/shared/constanst/auth.constant.js'
import { AuthenticationGuard } from '~/shared/guards/authentication.guard.js'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsServcie: PostsService) { }
  // @UseGuards(AccessTokenGuard)
  // @UseGuards(APIKeyGuard)
  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
  // @UseGuards(AuthenticationGuard)
  @Get()
  getPosts() {
    return this.postsServcie.getPosts()
  }
  @Post()
  createPost(@Body() body: any) {
    return this.postsServcie.createPost(body)
  }
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsServcie.getPost(id)
  }
  @Put(':id')
  updatePosts(@Param('id') id: string, @Body() body: any) {
    return this.postsServcie.updatePosts(id, body)
  }
}
