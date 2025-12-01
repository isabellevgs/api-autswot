import { FraquezasAmeacasShRepository } from './fraquezas-ameacas-sh.repository.js';
import { NotFoundError } from '../../utils/errors.js';

/**
 * Service de FraquezasAmeacasSh
 * Contém a lógica de negócio relacionada a fraquezas e ameaças SH
 * Nota: Este módulo é somente leitura - os dados são populados via seed/migration
 */
export class FraquezasAmeacasShService {
  private fraquezasAmeacasShRepository: FraquezasAmeacasShRepository;

  constructor() {
    this.fraquezasAmeacasShRepository = new FraquezasAmeacasShRepository();
  }

  /**
   * Obter registro por ID
   */
  async getFraquezasAmeacasShById(id: string) {
    const registro = await this.fraquezasAmeacasShRepository.findById(id);

    if (!registro) {
      throw new NotFoundError('Registro não encontrado');
    }

    return registro;
  }

  /**
   * Listar registros com paginação e filtros
   */
  async listFraquezasAmeacasSh(
    page: number = 1,
    limit: number = 10,
    numeroTraco?: number
  ) {
    const skip = (page - 1) * limit;
    const [registros, total] = await Promise.all([
      this.fraquezasAmeacasShRepository.findMany(skip, limit, numeroTraco),
      this.fraquezasAmeacasShRepository.count(numeroTraco),
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

