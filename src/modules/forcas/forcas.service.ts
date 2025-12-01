import { ForcasRepository } from './forcas.repository.js';
import { NotFoundError } from '../../utils/errors.js';

/**
 * Service de Forcas
 * Contém a lógica de negócio relacionada a forças
 * Nota: Este módulo é somente leitura - os dados são populados via seed/migration
 */
export class ForcasService {
  private forcasRepository: ForcasRepository;

  constructor() {
    this.forcasRepository = new ForcasRepository();
  }

  /**
   * Obter registro por ID
   */
  async getForcasById(id: string) {
    const registro = await this.forcasRepository.findById(id);

    if (!registro) {
      throw new NotFoundError('Registro não encontrado');
    }

    return registro;
  }

  /**
   * Listar registros com paginação e filtros
   */
  async listForcas(
    page: number = 1,
    limit: number = 10,
    numeroTraco?: number
  ) {
    const skip = (page - 1) * limit;
    const [registros, total] = await Promise.all([
      this.forcasRepository.findMany(skip, limit, numeroTraco),
      this.forcasRepository.count(numeroTraco),
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

