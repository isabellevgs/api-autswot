import { prisma } from '../../config/database.js';
import type { Post, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para Post
 * Isola a lógica de acesso ao banco de dados
 */
export class PostRepository {
  /**
   * Buscar post por ID
   */
  async findById(id: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Buscar post por ID com campos selecionados
   */
  async findByIdSelect<T>(id: string, select: Prisma.PostSelect) {
    return prisma.post.findUnique({
      where: { id },
      select,
    });
  }

  /**
   * Listar posts com paginação e busca opcional
   * Busca apenas no título do post
   */
  async findMany(skip: number = 0, take: number = 10, search?: string) {
    const where: Prisma.PostWhereInput = search && search.trim()
      ? {
          title: { contains: search.trim(), mode: 'insensitive' },
        }
      : {};

    return prisma.post.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Contar posts
   * Busca apenas no título do post
   */
  async count(search?: string): Promise<number> {
    const where: Prisma.PostWhereInput = search && search.trim()
      ? {
          title: { contains: search.trim(), mode: 'insensitive' },
        }
      : {};

    return prisma.post.count({ where });
  }

  /**
   * Criar post
   */
  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Atualizar post
   */
  async update(id: string, data: Prisma.PostUpdateInput): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Atualizar post e retornar campos selecionados
   */
  async updateSelect<T>(id: string, data: Prisma.PostUpdateInput, select: Prisma.PostSelect) {
    return prisma.post.update({
      where: { id },
      data,
      select,
    });
  }

  /**
   * Deletar post
   */
  async delete(id: string): Promise<Post> {
    return prisma.post.delete({
      where: { id },
    });
  }
}

