import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostsService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostsService]
})
export class PostModule {}
