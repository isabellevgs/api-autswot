import { prisma } from '../../config/database.js';
import type { Forcas, Prisma } from '../../../generated/prisma/index.js';

/**
 * Repository Pattern para Forcas
 * Isola a lógica de acesso ao banco de dados
 */
export class ForcasRepository {
  /**
   * Buscar registro por ID com traços relacionados
   */
  async findById(id: string): Promise<Forcas | null> {
    return prisma.forcas.findUnique({
      where: { id },
      include: {
        tracoNeutro: true,
        tracoForca: true,
        tracoFraqueza: true,
        tracoOportunidade: true,
      },
    });
  }

  /**
   * Buscar registro por numeroTraco com traços relacionados
   */
  async findByNumeroTraco(numeroTraco: number): Promise<Forcas | null> {
    return prisma.forcas.findFirst({
      where: { numeroTraco },
      include: {
        tracoNeutro: true,
        tracoForca: true,
        tracoFraqueza: true,
        tracoOportunidade: true,
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
  ): Promise<Forcas[]> {
    const where: any = {};
    if (numeroTraco !== undefined) {
      where.numeroTraco = numeroTraco;
    }

    return prisma.forcas.findMany({
      where,
      skip,
      take,
      include: {
        tracoNeutro: true,
        tracoForca: true,
        tracoFraqueza: true,
        tracoOportunidade: true,
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

    return prisma.forcas.count({ where });
  }

  /**
   * Criar registro
   */
  async create(data: Prisma.ForcasCreateInput): Promise<Forcas> {
    return prisma.forcas.create({
      data,
      include: {
        tracoNeutro: true,
        tracoForca: true,
        tracoFraqueza: true,
        tracoOportunidade: true,
      },
    });
  }

  /**
   * Atualizar registro
   */
  async update(
    id: string,
    data: Prisma.ForcasUpdateInput
  ): Promise<Forcas> {
    return prisma.forcas.update({
      where: { id },
      data,
      include: {
        tracoNeutro: true,
        tracoForca: true,
        tracoFraqueza: true,
        tracoOportunidade: true,
      },
    });
  }

  /**
   * Deletar registro
   */
  async delete(id: string): Promise<Forcas> {
    return prisma.forcas.delete({
      where: { id },
    });
  }
}

