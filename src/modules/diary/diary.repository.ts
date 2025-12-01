import { prisma } from '../../config/database.js';
import type { DiaryEntry, DiaryAnswer, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para DiaryEntry
 * Isola a lógica de acesso ao banco de dados
 */
export class DiaryRepository {
  /**
   * Buscar entrada do diário por ID
   */
  async findById(id: string): Promise<DiaryEntry | null> {
    return prisma.diaryEntry.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
                texto: true,
                ordem: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Buscar todas as entradas de um usuário
   */
  async findByUserId(userId: string): Promise<DiaryEntry[]> {
    return prisma.diaryEntry.findMany({
      where: { userId },
      orderBy: {
        date: 'desc',
      },
      include: {
        answers: {
          include: {
            question: {
              select: {
                id: true,
                texto: true,
                ordem: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Buscar entrada por usuário e data
   */
  async findByUserIdAndDate(userId: string, date: Date): Promise<DiaryEntry | null> {
    // Normalizar data para início do dia (00:00:00)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.diaryEntry.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        answers: {
          include: {
            question: {
              select: {
                id: true,
                texto: true,
                ordem: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Criar entrada do diário
   */
  async create(data: Prisma.DiaryEntryCreateInput): Promise<DiaryEntry> {
    return prisma.diaryEntry.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
                texto: true,
                ordem: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Atualizar entrada do diário
   */
  async update(id: string, data: Prisma.DiaryEntryUpdateInput): Promise<DiaryEntry> {
    return prisma.diaryEntry.update({
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
        answers: {
          include: {
            question: {
              select: {
                id: true,
                texto: true,
                ordem: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Deletar entrada do diário
   */
  async delete(id: string): Promise<DiaryEntry> {
    return prisma.diaryEntry.delete({
      where: { id },
    });
  }

  /**
   * Criar ou atualizar resposta
   */
  async upsertAnswer(
    entryId: string,
    questionId: string,
    texto: string
  ): Promise<DiaryAnswer> {
    return prisma.diaryAnswer.upsert({
      where: {
        entryId_questionId: {
          entryId,
          questionId,
        },
      },
      update: {
        texto,
      },
      create: {
        entryId,
        questionId,
        texto,
      },
    });
  }

  /**
   * Deletar resposta
   */
  async deleteAnswer(entryId: string, questionId: string): Promise<void> {
    await prisma.diaryAnswer.deleteMany({
      where: {
        entryId,
        questionId,
      },
    });
  }
}

