import { prisma } from '../../config/database.js';
import type { FraquezasOportunidades, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para FraquezasOportunidades
 * Isola a lógica de acesso ao banco de dados
 */
export class FraquezasOportunidadesRepository {
  /**
   * Buscar registro por ID com traços relacionados
   */
  async findById(id: string): Promise<FraquezasOportunidades | null> {
    return prisma.fraquezasOportunidades.findUnique({
      where: { id },
      include: {
        tracoNeutro: true,
        tracoOportunidade: true,
        tracoFraqueza: true,
      },
    });
  }

  /**
   * Buscar registro por numeroTraco com traços relacionados
   */
  async findByNumeroTraco(numeroTraco: number): Promise<FraquezasOportunidades | null> {
    return prisma.fraquezasOportunidades.findFirst({
      where: { numeroTraco },
      include: {
        tracoNeutro: true,
        tracoOportunidade: true,
        tracoFraqueza: true,
      },
    });
  }

  /**
   * Buscar todos os registros com paginação e filtros, incluindo traços relacionados
   */
  async findMany(
    skip: number = 0,
    take: number = 10,
    numeroTraco?: number
  ): Promise<FraquezasOportunidades[]> {
    const where: any = {};
    if (numeroTraco !== undefined) {
      where.numeroTraco = numeroTraco;
    }

    return prisma.fraquezasOportunidades.findMany({
      where,
      skip,
      take,
      include: {
        tracoNeutro: true,
        tracoOportunidade: true,
        tracoFraqueza: true,
      },
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

    return prisma.fraquezasOportunidades.count({ where });
  }

  /**
   * Criar registro
   */
  async create(data: Prisma.FraquezasOportunidadesCreateInput): Promise<FraquezasOportunidades> {
    return prisma.fraquezasOportunidades.create({
      data,
      include: {
        tracoNeutro: true,
        tracoOportunidade: true,
        tracoFraqueza: true,
      },
    });
  }

  /**
   * Atualizar registro
   */
  async update(
    id: string,
    data: Prisma.FraquezasOportunidadesUpdateInput
  ): Promise<FraquezasOportunidades> {
    return prisma.fraquezasOportunidades.update({
      where: { id },
      data,
      include: {
        tracoNeutro: true,
        tracoOportunidade: true,
        tracoFraqueza: true,
      },
    });
  }

  /**
   * Deletar registro
   */
  async delete(id: string): Promise<FraquezasOportunidades> {
    return prisma.fraquezasOportunidades.delete({
      where: { id },
    });
  }
}

