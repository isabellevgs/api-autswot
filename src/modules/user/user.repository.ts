import { prisma } from '../../config/database.js';
import type { User, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para User
 * Isola a lógica de acesso ao banco de dados
 */
export class UserRepository {
  /**
   * Buscar usuário por ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  /**
   * Buscar usuário por ID com campos selecionados
   */
  async findByIdSelect<T>(id: string, select: Prisma.UserSelect) {
    return prisma.user.findUnique({
      where: { id },
      select
    });
  }

  /**
   * Buscar usuário por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  /**
   * Listar usuários com paginação
   */
  async findMany(skip: number = 0, take: number = 10) {
    return prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Contar usuários
   */
  async count(): Promise<number> {
    return prisma.user.count();
  }

  /**
   * Atualizar usuário
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  /**
   * Atualizar usuário e retornar campos selecionados
   */
  async updateSelect<T>(id: string, data: Prisma.UserUpdateInput, select: Prisma.UserSelect) {
    return prisma.user.update({
      where: { id },
      data,
      select
    });
  }

  /**
   * Deletar usuário
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id }
    });
  }
}

