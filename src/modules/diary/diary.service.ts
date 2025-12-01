import { DiaryRepository } from './diary.repository.js';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';
import type {
  CreateDiaryEntryInput,
  UpdateDiaryEntryInput,
} from './diary.schemas.js';

/**
 * Service de DiaryEntry
 * Contém a lógica de negócio relacionada a entradas do diário
 */
export class DiaryService {
  private diaryRepository: DiaryRepository;

  constructor() {
    this.diaryRepository = new DiaryRepository();
  }

  /**
   * Obter entrada do diário por ID
   */
  async getDiaryEntryById(id: string, userId: string, isSuperUser: boolean = false) {
    const entry = await this.diaryRepository.findById(id);

    if (!entry) {
      throw new NotFoundError('Entrada do diário não encontrada');
    }

    // Verificar se o usuário tem permissão para ver esta entrada
    if (!isSuperUser && entry.userId !== userId) {
      throw new ForbiddenError('Você não tem permissão para ver esta entrada');
    }

    return entry;
  }

  /**
   * Listar entradas de um usuário
   */
  async getDiaryEntriesByUserId(userId: string, requestingUserId: string, isSuperUser: boolean = false) {
    // Verificar se o usuário tem permissão para ver as entradas
    if (!isSuperUser && userId !== requestingUserId) {
      throw new ForbiddenError('Você não tem permissão para ver as entradas deste usuário');
    }

    const entries = await this.diaryRepository.findByUserId(userId);
    return entries;
  }

  /**
   * Obter entrada por usuário e data
   */
  async getDiaryEntryByDate(userId: string, date: Date, requestingUserId: string, isSuperUser: boolean = false) {
    // Verificar se o usuário tem permissão
    if (!isSuperUser && userId !== requestingUserId) {
      throw new ForbiddenError('Você não tem permissão para ver esta entrada');
    }

    const entry = await this.diaryRepository.findByUserIdAndDate(userId, date);
    return entry;
  }

  /**
   * Criar entrada do diário
   */
  async createDiaryEntry(data: CreateDiaryEntryInput, userId: string) {
    // Normalizar data para início do dia
    const entryDate = typeof data.date === 'string' ? new Date(data.date) : data.date;
    entryDate.setHours(0, 0, 0, 0);

    // Verificar se já existe uma entrada para esta data
    const existingEntry = await this.diaryRepository.findByUserIdAndDate(userId, entryDate);
    if (existingEntry) {
      // Se já existe, atualizar ao invés de criar
      return this.updateDiaryEntry(existingEntry.id, { answers: data.answers }, userId, false);
    }

    // Criar entrada
    const entryData = {
      user: {
        connect: { id: userId },
      },
      date: entryDate,
    };

    const entry = await this.diaryRepository.create(entryData);

    // Criar/atualizar respostas se fornecidas
    if (data.answers) {
      await Promise.all(
        Object.entries(data.answers).map(([questionId, texto]) =>
          this.diaryRepository.upsertAnswer(entry.id, questionId, texto)
        )
      );
    }

    // Retornar entrada atualizada com respostas
    return this.diaryRepository.findById(entry.id);
  }

  /**
   * Atualizar entrada do diário
   */
  async updateDiaryEntry(
    id: string,
    data: UpdateDiaryEntryInput,
    userId: string,
    isSuperUser: boolean = false
  ) {
    // Verificar se a entrada existe e se o usuário tem permissão
    const existingEntry = await this.getDiaryEntryById(id, userId, isSuperUser);

    // Atualizar respostas se fornecidas
    if (data.answers !== undefined) {
      // Buscar todas as respostas atuais
      const currentEntry = await this.diaryRepository.findById(id);
      const currentQuestionIds = new Set(
        currentEntry?.answers.map((a) => a.questionId) || []
      );
      const newQuestionIds = new Set(Object.keys(data.answers));

      // Criar/atualizar respostas fornecidas
      await Promise.all(
        Object.entries(data.answers).map(([questionId, texto]) =>
          this.diaryRepository.upsertAnswer(id, questionId, texto)
        )
      );

      // Remover respostas que não foram fornecidas (opcional - pode manter as antigas)
      // Se quiser remover respostas não fornecidas, descomente:
      // const toDelete = Array.from(currentQuestionIds).filter(qId => !newQuestionIds.has(qId));
      // await Promise.all(toDelete.map(qId => this.diaryRepository.deleteAnswer(id, qId)));
    }

    // Retornar entrada atualizada com todas as respostas
    const updatedEntry = await this.diaryRepository.findById(id);
    if (!updatedEntry) {
      throw new NotFoundError('Entrada do diário não encontrada após atualização');
    }
    return updatedEntry;
  }

  /**
   * Deletar entrada do diário
   */
  async deleteDiaryEntry(id: string, userId: string, isSuperUser: boolean = false) {
    // Verificar se a entrada existe e se o usuário tem permissão
    await this.getDiaryEntryById(id, userId, isSuperUser);

    await this.diaryRepository.delete(id);
  }
}

