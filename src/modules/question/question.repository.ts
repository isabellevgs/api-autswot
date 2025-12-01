import { prisma } from '../../config/database.js';
import type { Question, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para Question
 * Isola a lógica de acesso ao banco de dados
 */
export class QuestionRepository {
  /**
   * Buscar pergunta por ID
   */
  async findById(id: string): Promise<Question | null> {
    return prisma.question.findUnique({
      where: { id },
      include: {
        user: {
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
   * Buscar todas as perguntas de um usuário ordenadas por ordem
   */
  async findByUserId(userId: string, onlyActive: boolean = false): Promise<Question[]> {
    const where: any = { userId };
    if (onlyActive) {
      where.ativo = true;
    }
    
    return prisma.question.findMany({
      where,
      orderBy: {
        ordem: 'asc',
      },
      include: {
        user: {
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
   * Criar pergunta
   */
  async create(data: Prisma.QuestionCreateInput): Promise<Question> {
    return prisma.question.create({
      data,
      include: {
        user: {
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
   * Atualizar pergunta
   */
  async update(id: string, data: Prisma.QuestionUpdateInput): Promise<Question> {
    return prisma.question.update({
      where: { id },
      data,
      include: {
        user: {
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
   * Atualizar múltiplas perguntas (para reordenação)
   */
  async updateMany(updates: Array<{ id: string; ordem: number }>): Promise<void> {
    await Promise.all(
      updates.map(({ id, ordem }) =>
        prisma.question.update({
          where: { id },
          data: { ordem },
        })
      )
    );
  }

  /**
   * Deletar pergunta
   */
  async delete(id: string): Promise<Question> {
    return prisma.question.delete({
      where: { id },
    });
  }

  /**
   * Obter a próxima ordem para um usuário
   */
  async getNextOrder(userId: string): Promise<number> {
    const lastQuestion = await prisma.question.findFirst({
      where: { userId },
      orderBy: { ordem: 'desc' },
      select: { ordem: true },
    });

    return lastQuestion ? lastQuestion.ordem + 1 : 1;
  }

  /**
   * Contar perguntas de um usuário
   */
  async countByUserId(userId: string): Promise<number> {
    return prisma.question.count({
      where: { userId },
    });
  }
}

