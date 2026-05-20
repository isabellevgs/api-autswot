import { FraquezasAmeacasChRepository } from './fraquezas-ameacas-ch.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import type { UpdateFraquezasAmeacasChInput } from './fraquezas-ameacas-ch.schemas.js';

export class FraquezasAmeacasChService {
  private fraquezasAmeacasChRepository: FraquezasAmeacasChRepository;

  constructor() {
    this.fraquezasAmeacasChRepository = new FraquezasAmeacasChRepository();
  }

  async getFraquezasAmeacasChById(id: string) {
    const registro = await this.fraquezasAmeacasChRepository.findById(id);
    if (!registro) throw new NotFoundError('Registro não encontrado');
    return registro;
  }

  async updateFraquezasAmeacasCh(id: string, data: UpdateFraquezasAmeacasChInput) {
    const exists = await this.fraquezasAmeacasChRepository.findById(id);
    if (!exists) throw new NotFoundError('Registro não encontrado');
    return this.fraquezasAmeacasChRepository.update(id, data);
  }

  async deleteFraquezasAmeacasCh(id: string) {
    const exists = await this.fraquezasAmeacasChRepository.findById(id);
    if (!exists) throw new NotFoundError('Registro não encontrado');
    return this.fraquezasAmeacasChRepository.delete(id);
  }

  async listFraquezasAmeacasCh(
    page: number = 1,
    limit: number = 10,
    numeroTraco?: number
  ) {
    const skip = (page - 1) * limit;
    const [registros, total] = await Promise.all([
      this.fraquezasAmeacasChRepository.findMany(skip, limit, numeroTraco),
      this.fraquezasAmeacasChRepository.count(numeroTraco),
    ]);

    return {
      registros,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
