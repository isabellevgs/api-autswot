import { prisma } from '../../config/database.js';
import type { User, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para Auth
 * Isola a lógica de acesso ao banco de dados
 * Facilita testes e manutenção
 */
export class AuthRepository {
  /**
   * Buscar usuário por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  /**
   * Buscar usuário por email com campos selecionados
   */
  async findByEmailSelect<T>(email: string, select: Prisma.UserSelect) {
    return prisma.user.findUnique({
      where: { email },
      select
    });
  }

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
   * Criar novo usuário
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data
    });
  }

  /**
   * Criar usuário e retornar campos selecionados
   */
  async createSelect<T>(data: Prisma.UserCreateInput, select: Prisma.UserSelect) {
    return prisma.user.create({
      data,
      select
    });
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

  /**
   * Verificar se email já existe (excluindo um ID)
   */
  async emailExistsExcept(email: string, exceptId: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: exceptId }
      }
    });
    return user !== null;
  }
}

