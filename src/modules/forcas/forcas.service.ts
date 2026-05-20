import { ForcasRepository } from './forcas.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import { prisma } from '../../config/database.js';
import type { CreateForcasInput, UpdateForcasInput } from './forcas.schemas.js';

export class ForcasService {
  private repo: ForcasRepository;

  constructor() {
    this.repo = new ForcasRepository();
  }

  async getForcasById(id: string) {
    const registro = await this.repo.findById(id);
    if (!registro) throw new NotFoundError('Registro não encontrado');
    return registro;
  }

  async createForcas(data: CreateForcasInput) {
    const { tracoNeutro, tracoForca, tracoFraqueza, tracoOportunidade, ...mainData } = data;

    return prisma.$transaction(async (tx) => {
      const registro = await tx.forcas.create({ data: mainData });

      if (tracoNeutro?.length)
        await tx.tracoNeutroF.createMany({ data: tracoNeutro.map(valor => ({ valor, forcasId: registro.id })) });
      if (tracoForca?.length)
        await tx.tracoForcaF.createMany({ data: tracoForca.map(valor => ({ valor, forcasId: registro.id })) });
      if (tracoFraqueza?.length)
        await tx.tracoFraquezaF.createMany({ data: tracoFraqueza.map(valor => ({ valor, forcasId: registro.id })) });
      if (tracoOportunidade?.length)
        await tx.tracoOportunidadeF.createMany({ data: tracoOportunidade.map(valor => ({ valor, forcasId: registro.id })) });

      return tx.forcas.findUnique({
        where: { id: registro.id },
        include: { tracoNeutro: true, tracoForca: true, tracoFraqueza: true, tracoOportunidade: true },
      });
    });
  }

  async updateForcas(id: string, data: UpdateForcasInput) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundError('Registro não encontrado');

    const { tracoNeutro, tracoForca, tracoFraqueza, tracoOportunidade, ...mainData } = data;

    return prisma.$transaction(async (tx) => {
      if (Object.keys(mainData).length > 0)
        await tx.forcas.update({ where: { id }, data: mainData });

      if (tracoNeutro !== undefined) {
        await tx.tracoNeutroF.deleteMany({ where: { forcasId: id } });
        if (tracoNeutro.length > 0)
          await tx.tracoNeutroF.createMany({ data: tracoNeutro.map(valor => ({ valor, forcasId: id })) });
      }
      if (tracoForca !== undefined) {
        await tx.tracoForcaF.deleteMany({ where: { forcasId: id } });
        if (tracoForca.length > 0)
          await tx.tracoForcaF.createMany({ data: tracoForca.map(valor => ({ valor, forcasId: id })) });
      }
      if (tracoFraqueza !== undefined) {
        await tx.tracoFraquezaF.deleteMany({ where: { forcasId: id } });
        if (tracoFraqueza.length > 0)
          await tx.tracoFraquezaF.createMany({ data: tracoFraqueza.map(valor => ({ valor, forcasId: id })) });
      }
      if (tracoOportunidade !== undefined) {
        await tx.tracoOportunidadeF.deleteMany({ where: { forcasId: id } });
        if (tracoOportunidade.length > 0)
          await tx.tracoOportunidadeF.createMany({ data: tracoOportunidade.map(valor => ({ valor, forcasId: id })) });
      }

      return tx.forcas.findUnique({
        where: { id },
        include: { tracoNeutro: true, tracoForca: true, tracoFraqueza: true, tracoOportunidade: true },
      });
    });
  }

  async deleteForcas(id: string) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundError('Registro não encontrado');
    return this.repo.delete(id);
  }

  async listForcas(page: number = 1, limit: number = 10, numeroTraco?: number) {
    const skip = (page - 1) * limit;
    const [registros, total] = await Promise.all([
      this.repo.findMany(skip, limit, numeroTraco),
      this.repo.count(numeroTraco),
    ]);
    return { registros, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
