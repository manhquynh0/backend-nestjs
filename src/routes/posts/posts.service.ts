import { Injectable } from '@nestjs/common'
import { PrismaService } from '~/shared/services/prisma.service.js'
import envConfig from '~/shared/config.js'
@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) { }
  getPosts() {
    console.log(envConfig.ACCESS_TOKEN_SECRET)
    return this.prismaService.post.findMany()
  }
  createPost(body: any) {

    return this.prismaService.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: body.password,
      }
    })
  }
  getPost(id: string) {
    return `Post ${id}`
  }
  updatePosts(id: string, body: any) {
    return `updatePosts ${id}`
  }
}

