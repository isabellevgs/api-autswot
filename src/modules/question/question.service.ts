import { QuestionRepository } from './question.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import type { CreateQuestionInput, UpdateQuestionInput, ReorderQuestionsInput } from './question.schemas.js';

/**
 * Service de Question
 * Contém a lógica de negócio relacionada a perguntas
 */
export class QuestionService {
  private questionRepository: QuestionRepository;

  constructor() {
    this.questionRepository = new QuestionRepository();
  }

  /**
   * Obter pergunta por ID
   */
  async getQuestionById(id: string) {
    const question = await this.questionRepository.findById(id);

    if (!question) {
      throw new NotFoundError('Pergunta não encontrada');
    }

    return question;
  }

  /**
   * Listar perguntas de um usuário
   */
  async getQuestionsByUserId(userId: string) {
    const questions = await this.questionRepository.findByUserId(userId);
    return questions;
  }

  /**
   * Criar pergunta
   */
  async createQuestion(data: CreateQuestionInput, userId: string) {
    // Se não foi informada a ordem, usar a próxima disponível
    const ordem = data.ordem || await this.questionRepository.getNextOrder(userId);

    const questionData = {
      texto: data.texto,
      ordem,
      ativo: true, // Sempre criar como ativa por padrão
      user: {
        connect: { id: userId },
      },
    };

    const question = await this.questionRepository.create(questionData);
    return question;
  }

  /**
   * Atualizar pergunta
   * @param userId - ID do usuário autenticado (pode ser SUPER_USER editando perguntas de outros)
   */
  async updateQuestion(id: string, data: UpdateQuestionInput, userId: string, isSuperUser: boolean = false) {
    // Verificar se pergunta existe
    const existingQuestion = await this.questionRepository.findById(id);
    if (!existingQuestion) {
      throw new NotFoundError('Pergunta não encontrada');
    }

    // Verificar se a pergunta pertence ao usuário (ou se é SUPER_USER)
    if (!isSuperUser && existingQuestion.userId !== userId) {
      throw new NotFoundError('Pergunta não encontrada');
    }

    const updateData: any = {};
    if (data.texto !== undefined) updateData.texto = data.texto;
    if (data.ordem !== undefined) updateData.ordem = data.ordem;
    if (data.ativo !== undefined) updateData.ativo = data.ativo;

    const updatedQuestion = await this.questionRepository.update(id, updateData);
    return updatedQuestion;
  }

  /**
   * Reordenar perguntas
   * @param userId - ID do usuário autenticado (pode ser SUPER_USER editando perguntas de outros)
   */
  async reorderQuestions(data: ReorderQuestionsInput, userId: string, isSuperUser: boolean = false) {
    // Verificar se todas as perguntas pertencem ao usuário (ou se é SUPER_USER)
    const questions = await Promise.all(
      data.questions.map(({ id }) => this.questionRepository.findById(id))
    );

    const invalidQuestions = questions.filter(
      (q) => !q || (!isSuperUser && q.userId !== userId)
    );

    if (invalidQuestions.length > 0) {
      throw new NotFoundError('Uma ou mais perguntas não foram encontradas');
    }

    // Atualizar a ordem de todas as perguntas
    await this.questionRepository.updateMany(data.questions);

    // Retornar as perguntas atualizadas (do primeiro usuário das perguntas)
    const firstQuestion = questions[0];
    if (!firstQuestion) {
      throw new NotFoundError('Nenhuma pergunta encontrada');
    }
    return this.questionRepository.findByUserId(firstQuestion.userId);
  }

  /**
   * Deletar pergunta
   * @param userId - ID do usuário autenticado (pode ser SUPER_USER deletando perguntas de outros)
   */
  async deleteQuestion(id: string, userId: string, isSuperUser: boolean = false) {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new NotFoundError('Pergunta não encontrada');
    }

    // Verificar se a pergunta pertence ao usuário (ou se é SUPER_USER)
    if (!isSuperUser && question.userId !== userId) {
      throw new NotFoundError('Pergunta não encontrada');
    }

    await this.questionRepository.delete(id);
    return { message: 'Pergunta excluída com sucesso' };
  }
}

