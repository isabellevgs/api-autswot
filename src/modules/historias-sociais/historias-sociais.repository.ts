import { prisma } from '../../config/database.js';
import type { HistoriasSociais, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para HistoriasSociais
 * Isola a lógica de acesso ao banco de dados
 */
export class HistoriasSociaisRepository {
  /**
   * Buscar registro por ID
   */
  async findById(id: string): Promise<HistoriasSociais | null> {
    return prisma.historiasSociais.findUnique({
      where: { id },
    });
  }

  /**
   * Buscar registro por número da história
   */
  async findByNumeroHistoria(numeroHistoria: number): Promise<HistoriasSociais | null> {
    return prisma.historiasSociais.findFirst({
      where: { numeroHistoria },
    });
  }

  /**
   * Buscar todos os registros com paginação e filtros
   */
  async findMany(
    skip: number = 0,
    take: number = 10,
    numeroHistoria?: number
  ): Promise<HistoriasSociais[]> {
    const where: any = {};
    if (numeroHistoria !== undefined) {
      where.numeroHistoria = numeroHistoria;
    }

    return prisma.historiasSociais.findMany({
      where,
      skip,
      take,
      orderBy: {
        numeroHistoria: 'asc',
      },
    });
  }

  /**
   * Contar registros
   */
  async count(numeroHistoria?: number): Promise<number> {
    const where: any = {};
    if (numeroHistoria !== undefined) {
      where.numeroHistoria = numeroHistoria;
    }

    return prisma.historiasSociais.count({ where });
  }

  /**
   * Criar registro
   */
  async create(data: Prisma.HistoriasSociaisCreateInput): Promise<HistoriasSociais> {
    return prisma.historiasSociais.create({
      data,
    });
  }

  /**
   * Atualizar registro
   */
  async update(
    id: string,
    data: Prisma.HistoriasSociaisUpdateInput
  ): Promise<HistoriasSociais> {
    return prisma.historiasSociais.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletar registro
   */
  async delete(id: string): Promise<HistoriasSociais> {
    return prisma.historiasSociais.delete({
      where: { id },
    });
  }
}

