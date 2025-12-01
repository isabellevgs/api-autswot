import { prisma } from '../../config/database.js';
import type { QuestionarioResposta, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para QuestionarioResposta
 * Isola a lógica de acesso ao banco de dados
 */
export class QuestionarioRespostaRepository {
  /**
   * Buscar resposta por ID
   */
  async findById(id: string): Promise<QuestionarioResposta | null> {
    return prisma.questionarioResposta.findUnique({
      where: { id },
    });
  }

  /**
   * Buscar resposta por usuário, pergunta e tipo
   */
  async findByUserPerguntaTipo(
    userId: string,
    perguntaId: string,
    tipo: string
  ): Promise<QuestionarioResposta | null> {
    return prisma.questionarioResposta.findUnique({
      where: {
        userId_perguntaId_tipo: {
          userId,
          perguntaId,
          tipo,
        },
      },
    });
  }

  /**
   * Buscar todas as respostas de um usuário
   */
  async findByUserId(userId: string, tipo?: string): Promise<QuestionarioResposta[]> {
    const where: any = { userId };
    if (tipo) {
      where.tipo = tipo;
    }

    return prisma.questionarioResposta.findMany({
      where,
      orderBy: [
        { tipo: 'asc' },
        { numeroTraco: 'asc' },
      ],
    });
  }

  /**
   * Criar ou atualizar resposta (upsert)
   */
  async upsert(data: {
    userId: string;
    perguntaId: string;
    tipo: string;
    numeroTraco: number;
    resposta?: string | null;
    frequencia?: number | null;
    intensidade?: number | null;
  }): Promise<QuestionarioResposta> {
    return prisma.questionarioResposta.upsert({
      where: {
        userId_perguntaId_tipo: {
          userId: data.userId,
          perguntaId: data.perguntaId,
          tipo: data.tipo,
        },
      },
      update: {
        resposta: data.resposta,
        frequencia: data.frequencia,
        intensidade: data.intensidade,
      },
      create: {
        userId: data.userId,
        perguntaId: data.perguntaId,
        tipo: data.tipo,
        numeroTraco: data.numeroTraco,
        resposta: data.resposta,
        frequencia: data.frequencia,
        intensidade: data.intensidade,
      },
    });
  }

  /**
   * Criar múltiplas respostas em batch
   */
  async createMany(respostas: Array<{
    userId: string;
    perguntaId: string;
    tipo: string;
    numeroTraco: number;
    resposta?: string | null;
    frequencia?: number | null;
    intensidade?: number | null;
  }>): Promise<{ count: number }> {
    // Usar transação para garantir atomicidade
    return prisma.$transaction(async (tx) => {
      const promises = respostas.map(resposta =>
        tx.questionarioResposta.upsert({
          where: {
            userId_perguntaId_tipo: {
              userId: resposta.userId,
              perguntaId: resposta.perguntaId,
              tipo: resposta.tipo,
            },
          },
          update: {
            resposta: resposta.resposta,
            frequencia: resposta.frequencia,
            intensidade: resposta.intensidade,
          },
          create: resposta,
        })
      );
      
      await Promise.all(promises);
      return { count: respostas.length };
    });
  }

  /**
   * Deletar resposta
   */
  async delete(id: string): Promise<QuestionarioResposta> {
    return prisma.questionarioResposta.delete({
      where: { id },
    });
  }

  /**
   * Deletar todas as respostas de um usuário
   */
  async deleteByUserId(userId: string, tipo?: string): Promise<{ count: number }> {
    const where: any = { userId };
    if (tipo) {
      where.tipo = tipo;
    }

    return prisma.questionarioResposta.deleteMany({ where });
  }
}

