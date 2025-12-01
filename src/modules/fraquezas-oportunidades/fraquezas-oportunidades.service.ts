import { FraquezasOportunidadesRepository } from './fraquezas-oportunidades.repository.js';
import { NotFoundError } from '../../utils/errors.js';

/**
 * Service de FraquezasOportunidades
 * Contém a lógica de negócio relacionada a fraquezas e oportunidades
 * Nota: Este módulo é somente leitura - os dados são populados via seed/migration
 */
export class FraquezasOportunidadesService {
  private fraquezasOportunidadesRepository: FraquezasOportunidadesRepository;

  constructor() {
    this.fraquezasOportunidadesRepository = new FraquezasOportunidadesRepository();
  }

  /**
   * Obter registro por ID
   */
  async getFraquezasOportunidadesById(id: string) {
    const registro = await this.fraquezasOportunidadesRepository.findById(id);

    if (!registro) {
      throw new NotFoundError('Registro não encontrado');
    }

    return registro;
  }

  /**
   * Listar registros com paginação e filtros
   */
  async listFraquezasOportunidades(
    page: number = 1,
    limit: number = 10,
    numeroTraco?: number
  ) {
    const skip = (page - 1) * limit;
    const [registros, total] = await Promise.all([
      this.fraquezasOportunidadesRepository.findMany(skip, limit, numeroTraco),
      this.fraquezasOportunidadesRepository.count(numeroTraco),
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

