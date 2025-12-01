import { prisma } from '../../config/database.js';
import type { FraquezasAmeacasCh, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para FraquezasAmeacasCh
 * Isola a lógica de acesso ao banco de dados
 */
export class FraquezasAmeacasChRepository {
  /**
   * Buscar registro por ID
   */
  async findById(id: string): Promise<FraquezasAmeacasCh | null> {
    return prisma.fraquezasAmeacasCh.findUnique({
      where: { id },
    });
  }

  /**
   * Buscar registro por numeroTraco
   */
  async findByNumeroTraco(numeroTraco: number): Promise<FraquezasAmeacasCh | null> {
    return prisma.fraquezasAmeacasCh.findFirst({
      where: { numeroTraco },
    });
  }

  /**
   * Buscar todos os registros com paginação e filtros
   */
  async findMany(
    skip: number = 0,
    take: number = 10,
    numeroTraco?: number
  ): Promise<FraquezasAmeacasCh[]> {
    const where: any = {};
    if (numeroTraco !== undefined) {
      where.numeroTraco = numeroTraco;
    }

    return prisma.fraquezasAmeacasCh.findMany({
      where,
      skip,
      take,
      orderBy: {
        numeroTraco: 'asc',
      },
    });
  }

  /**
   * Contar registros
   */
  async count(numeroTraco?: number): Promise<number> {
    const where: any = {};
    if (numeroTraco !== undefined) {
      where.numeroTraco = numeroTraco;
    }

    return prisma.fraquezasAmeacasCh.count({ where });
  }

  /**
   * Criar registro
   */
  async create(data: Prisma.FraquezasAmeacasChCreateInput): Promise<FraquezasAmeacasCh> {
    return prisma.fraquezasAmeacasCh.create({
      data,
    });
  }

  /**
   * Atualizar registro
   */
  async update(
    id: string,
    data: Prisma.FraquezasAmeacasChUpdateInput
  ): Promise<FraquezasAmeacasCh> {
    return prisma.fraquezasAmeacasCh.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletar registro
   */
  async delete(id: string): Promise<FraquezasAmeacasCh> {
    return prisma.fraquezasAmeacasCh.delete({
      where: { id },
    });
  }
}

