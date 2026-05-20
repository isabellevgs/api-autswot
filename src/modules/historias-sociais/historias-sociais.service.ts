import { HistoriasSociaisRepository } from './historias-sociais.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import type { UpdateHistoriasSociaisInput } from './historias-sociais.schemas.js';

/**
 * Service de HistoriasSociais
 * Contém a lógica de negócio relacionada a histórias sociais
 * Nota: Este módulo é somente leitura - os dados são populados via seed/migration
 */
export class HistoriasSociaisService {
  private historiasSociaisRepository: HistoriasSociaisRepository;

  constructor() {
    this.historiasSociaisRepository = new HistoriasSociaisRepository();
  }

  /**
   * Obter registro por ID
   */
  async getHistoriasSociaisById(id: string) {
    const registro = await this.historiasSociaisRepository.findById(id);

    if (!registro) {
      throw new NotFoundError('Registro não encontrado');
    }

    return registro;
  }

  /**
   * Obter registro por número da história
   */
  async getHistoriasSociaisByNumeroHistoria(numeroHistoria: number) {
    const registro = await this.historiasSociaisRepository.findByNumeroHistoria(numeroHistoria);

    if (!registro) {
      throw new NotFoundError('Registro não encontrado');
    }

    return registro;
  }

  /**
   * Atualizar registro por ID
   */
  async updateHistoriasSociais(id: string, data: UpdateHistoriasSociaisInput) {
    const exists = await this.historiasSociaisRepository.findById(id);
    if (!exists) throw new NotFoundError('Registro não encontrado');
    return this.historiasSociaisRepository.update(id, data);
  }

  /**
   * Deletar registro por ID
   */
  async deleteHistoriasSociais(id: string) {
    const exists = await this.historiasSociaisRepository.findById(id);
    if (!exists) throw new NotFoundError('Registro não encontrado');
    return this.historiasSociaisRepository.delete(id);
  }

  /**
   * Listar registros com paginação e filtros
   */
  async listHistoriasSociais(
    page: number = 1,
    limit: number = 10,
    numeroHistoria?: number
  ) {
    const skip = (page - 1) * limit;
    const [registros, total] = await Promise.all([
      this.historiasSociaisRepository.findMany(skip, limit, numeroHistoria),
      this.historiasSociaisRepository.count(numeroHistoria),
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

