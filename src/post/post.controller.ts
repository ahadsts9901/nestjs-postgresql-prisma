import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { PostsService } from './post.service';
import { RequestWithUser } from 'src/middlware';

@Controller('post')
export class PostController {

    constructor(private readonly postsService: PostsService) { }

    @Get()
    findAll() {
        return this.postsService.findAll()
    }

    @Post()
    create(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser) {
        return this.postsService.create(createPostDto, req)
    }

    @Delete(':postId')
    deleteOne(@Param('postId') postId: string) {
        return this.postsService.deleteOne(postId)
    }

    @Put(':postId')
    updateOne(@Param("postId") postId: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.updateOne(postId, updatePostDto)
    }

}