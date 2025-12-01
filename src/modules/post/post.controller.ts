import type { FastifyRequest, FastifyReply } from 'fastify';
import { PostService } from './post.service.js';
import {
  createPostSchema,
  updatePostSchema,
  getPostParamsSchema,
  listPostsQuerySchema,
  type CreatePostInput,
  type UpdatePostInput,
  type GetPostParams,
  type ListPostsQuery,
} from './post.schemas.js';

const postService = new PostService();

export class PostController {
  async getPost(request: FastifyRequest<{ Params: GetPostParams }>, reply: FastifyReply) {
    const { id } = getPostParamsSchema.parse(request.params);
    const post = await postService.getPostById(id);
    return reply.send({ post });
  }

  async listPosts(request: FastifyRequest<{ Querystring: ListPostsQuery }>, reply: FastifyReply) {
    const { page = 1, limit = 10, search } = listPostsQuerySchema.parse(request.query);
    // Normalizar o termo de busca
    const normalizedSearch = search?.trim() || undefined;
    const result = await postService.listPosts(page, limit, normalizedSearch);
    return reply.send(result);
  }

  async createPost(
    request: FastifyRequest<{ Body: CreatePostInput }>,
    reply: FastifyReply
  ) {
    const data = createPostSchema.parse(request.body);
    const userId = (request.user as any).id;
    const post = await postService.createPost(data, userId);

    return reply.status(201).send({
      message: 'Post criado com sucesso',
      post,
    });
  }

  async updatePost(
    request: FastifyRequest<{ Params: GetPostParams; Body: UpdatePostInput }>,
    reply: FastifyReply
  ) {
    const { id } = getPostParamsSchema.parse(request.params);
    const data = updatePostSchema.parse(request.body) as UpdatePostInput;
    const userId = (request.user as any).id;
    const post = await postService.updatePost(id, data, userId);

    return reply.send({
      message: 'Post atualizado com sucesso',
      post,
    });
  }

  async deletePost(request: FastifyRequest<{ Params: GetPostParams }>, reply: FastifyReply) {
    const { id } = getPostParamsSchema.parse(request.params);
    const result = await postService.deletePost(id);
    return reply.send(result);
  }
}

