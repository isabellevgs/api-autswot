import { PostRepository } from './post.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import type { CreatePostInput, UpdatePostInput } from './post.schemas.js';

/**
 * Service de Post
 * Contém a lógica de negócio relacionada a posts
 */
export class PostService {
  private postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository();
  }

  /**
   * Obter post por ID
   */
  async getPostById(id: string) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new NotFoundError('Post não encontrado');
    }

    return post;
  }

  /**
   * Listar posts com paginação e busca opcional
   * Busca apenas no título do post
   */
  async listPosts(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    // Normalizar o termo de busca (trim e garantir que não seja vazio)
    const normalizedSearch = search?.trim() || undefined;
    const [posts, total] = await Promise.all([
      this.postRepository.findMany(skip, limit, normalizedSearch),
      this.postRepository.count(normalizedSearch),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Criar post
   */
  async createPost(data: CreatePostInput, authorId: string) {
    const postData = {
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl || null,
      author: {
        connect: { id: authorId },
      },
    };

    const post = await this.postRepository.create(postData);
    return post;
  }

  /**
   * Atualizar post
   */
  async updatePost(id: string, data: UpdatePostInput, authorId: string) {
    // Verificar se post existe
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new NotFoundError('Post não encontrado');
    }

    // Verificar se o usuário é o autor (ou se é SUPER_USER, pode editar qualquer post)
    // Isso será verificado no controller através do role do usuário

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.imageUrl !== undefined) {
      updateData.imageUrl = data.imageUrl || null;
    }

    const updatedPost = await this.postRepository.update(id, updateData);
    return updatedPost;
  }

  /**
   * Deletar post
   */
  async deletePost(id: string) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundError('Post não encontrado');
    }

    await this.postRepository.delete(id);
    return { message: 'Post excluído com sucesso' };
  }
}

