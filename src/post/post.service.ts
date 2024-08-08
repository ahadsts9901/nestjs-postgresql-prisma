import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { prisma } from "../../prisma/index"
import { RequestWithUser } from 'src/middlware';

@Injectable()
export class PostsService {

    async findAll() {

        try {

            const resp = await prisma.post.findMany({
                orderBy: { id: "desc" },
                include: { author: true }
            })

            return {
                message: "posts fetched",
                data: resp
            }

        } catch (error) {
            console.error(error)
            throw new Error('internal server error')
        }

    }

    async create(createPostDto: CreatePostDto, req: RequestWithUser) {

        try {

            const { title, description } = createPostDto

            const { id } = req?.currentUser

            if (!title || !description || title.trim() === "" || description.trim() === "") {
                throw new BadRequestException('title or description missing')
            }

            const res = await prisma.post.create({
                data: {
                    title: title,
                    description: description,
                    authorId: id
                }
            })

            return {
                message: "post created"
            }

        } catch (error) {
            console.error(error)
            throw new Error('internal server error')
        }

    }

    async deleteOne(postId: string) {

        if (!postId || postId.trim() === "") {
            throw new BadRequestException('postId not provided')
        }

        const resp = await prisma.post.findUnique({ where: { id: +postId } })

        if (!resp) {
            throw new NotFoundException('post not found')
        }

        const delResp = await prisma.post.delete({ where: { id: +postId } })

        return {
            message: "post deleted"
        }


    }

    async updateOne(postId: string, updatePostDto: UpdatePostDto) {

        const { title, description } = updatePostDto

        if (!title || !description || title.trim() === "" || description.trim() === "") {
            throw new BadRequestException('title or description missing')
        }

        if (!postId || postId.trim() === "") {
            throw new BadRequestException('postId not provided')
        }

        const resp = await prisma.post.findUnique({ where: { id: +postId } })

        if (!resp) {
            throw new NotFoundException('post not found')
        }

        const updateResp = await prisma.post.update(
            {
                where: { id: +postId },
                data: {
                    title: title,
                    description: description
                }
            })

        return {
            message: "post updated"
        }

    }

}