import { FraquezasAmeacasChRepository } from './fraquezas-ameacas-ch.repository.js';
import { NotFoundError } from '../../utils/errors.js';

/**
 * Service de FraquezasAmeacasCh
 * Contém a lógica de negócio relacionada a fraquezas e ameaças CH
 * Nota: Este módulo é somente leitura - os dados são populados via seed/migration
 */
export class FraquezasAmeacasChService {
  private fraquezasAmeacasChRepository: FraquezasAmeacasChRepository;

  constructor() {
    this.fraquezasAmeacasChRepository = new FraquezasAmeacasChRepository();
  }

  /**
   * Obter registro por ID
   */
  async getFraquezasAmeacasChById(id: string) {
    const registro = await this.fraquezasAmeacasChRepository.findById(id);

    if (!registro) {
      throw new NotFoundError('Registro não encontrado');
    }

    return registro;
  }

  /**
   * Listar registros com paginação e filtros
   */
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
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

