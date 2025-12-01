import { prisma } from '../../config/database.js';
import type { FraquezasAmeacasSh, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para FraquezasAmeacasSh
 * Isola a lógica de acesso ao banco de dados
 */
export class FraquezasAmeacasShRepository {
  /**
   * Buscar registro por ID
   */
  async findById(id: string): Promise<FraquezasAmeacasSh | null> {
    return prisma.fraquezasAmeacasSh.findUnique({
      where: { id },
    });
  }

  /**
   * Buscar registro por numeroTraco
   */
  async findByNumeroTraco(numeroTraco: number): Promise<FraquezasAmeacasSh | null> {
    return prisma.fraquezasAmeacasSh.findFirst({
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
  ): Promise<FraquezasAmeacasSh[]> {
    const where: any = {};
    if (numeroTraco !== undefined) {
      where.numeroTraco = numeroTraco;
    }

    return prisma.fraquezasAmeacasSh.findMany({
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

    return prisma.fraquezasAmeacasSh.count({ where });
  }

  /**
   * Criar registro
   */
  async create(data: Prisma.FraquezasAmeacasShCreateInput): Promise<FraquezasAmeacasSh> {
    return prisma.fraquezasAmeacasSh.create({
      data,
    });
  }

  /**
   * Atualizar registro
   */
  async update(
    id: string,
    data: Prisma.FraquezasAmeacasShUpdateInput
  ): Promise<FraquezasAmeacasSh> {
    return prisma.fraquezasAmeacasSh.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletar registro
   */
  async delete(id: string): Promise<FraquezasAmeacasSh> {
    return prisma.fraquezasAmeacasSh.delete({
      where: { id },
    });
  }
}

