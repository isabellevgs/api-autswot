import { FraquezasOportunidadesRepository } from './fraquezas-oportunidades.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import { prisma } from '../../config/database.js';
import type { UpdateFraquezasOportunidadesInput } from './fraquezas-oportunidades.schemas.js';

export class FraquezasOportunidadesService {
  private repo: FraquezasOportunidadesRepository;

  constructor() {
    this.repo = new FraquezasOportunidadesRepository();
  }

  async getFraquezasOportunidadesById(id: string) {
    const registro = await this.repo.findById(id);
    if (!registro) throw new NotFoundError('Registro não encontrado');
    return registro;
  }

  async updateFraquezasOportunidades(id: string, data: UpdateFraquezasOportunidadesInput) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundError('Registro não encontrado');

    const { tracoNeutro, tracoOportunidade, tracoFraqueza, ...mainData } = data;

    return prisma.$transaction(async (tx) => {
      // Atualiza campos principais
      await tx.fraquezasOportunidades.update({ where: { id }, data: mainData });

      // Substitui tracoNeutro se fornecido
      if (tracoNeutro !== undefined) {
        await tx.tracoNeutroFO.deleteMany({ where: { fraquezasOportunidadesId: id } });
        if (tracoNeutro.length > 0) {
          await tx.tracoNeutroFO.createMany({
            data: tracoNeutro.map((valor) => ({ valor, fraquezasOportunidadesId: id })),
          });
        }
      }

      // Substitui tracoOportunidade se fornecido
      if (tracoOportunidade !== undefined) {
        await tx.tracoOportunidadeFO.deleteMany({ where: { fraquezasOportunidadesId: id } });
        if (tracoOportunidade.length > 0) {
          await tx.tracoOportunidadeFO.createMany({
            data: tracoOportunidade.map((valor) => ({ valor, fraquezasOportunidadesId: id })),
          });
        }
      }

      // Substitui tracoFraqueza se fornecido
      if (tracoFraqueza !== undefined) {
        await tx.tracoFraquezaFO.deleteMany({ where: { fraquezasOportunidadesId: id } });
        if (tracoFraqueza.length > 0) {
          await tx.tracoFraquezaFO.createMany({
            data: tracoFraqueza.map((valor) => ({ valor, fraquezasOportunidadesId: id })),
          });
        }
      }

      return tx.fraquezasOportunidades.findUnique({
        where: { id },
        include: { tracoNeutro: true, tracoOportunidade: true, tracoFraqueza: true },
      });
    });
  }

  async deleteFraquezasOportunidades(id: string) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundError('Registro não encontrado');
    return this.repo.delete(id);
  }

  async listFraquezasOportunidades(page: number = 1, limit: number = 10, numeroTraco?: number) {
    const skip = (page - 1) * limit;
    const [registros, total] = await Promise.all([
      this.repo.findMany(skip, limit, numeroTraco),
      this.repo.count(numeroTraco),
    ]);
    return { registros, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
