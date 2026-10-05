import { Body, Controller, Get, Post, Param, Put } from '@nestjs/common'
import { PostsService } from './posts.service.js'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsServcie: PostsService) {}
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
