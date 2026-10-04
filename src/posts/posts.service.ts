import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  getPosts() {
    return 'manh quynh dep trai'
  }
  createPost(body: any) {
    return `Body : ${body}`
  }
  getPost(id: string) {
    return `Post ${id}`
  }
  updatePosts(id: string, body: any) {
    return `updatePosts ${id}`
  }

}
