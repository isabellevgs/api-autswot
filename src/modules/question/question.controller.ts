import type { FastifyRequest, FastifyReply } from 'fastify';
import { QuestionService } from './question.service.js';
import {
  createQuestionSchema,
  updateQuestionSchema,
  getQuestionParamsSchema,
  getQuestionsByUserParamsSchema,
  reorderQuestionsSchema,
  type CreateQuestionInput,
  type UpdateQuestionInput,
  type GetQuestionParams,
  type GetQuestionsByUserParams,
  type ReorderQuestionsInput,
} from './question.schemas.js';

const questionService = new QuestionService();

export class QuestionController {
  async getQuestion(request: FastifyRequest<{ Params: GetQuestionParams }>, reply: FastifyReply) {
    const { id } = getQuestionParamsSchema.parse(request.params);
    const question = await questionService.getQuestionById(id);
    return reply.send({ question });
  }

  async getQuestionsByUser(
    request: FastifyRequest<{ Params: GetQuestionsByUserParams }>,
    reply: FastifyReply
  ) {
    const { userId } = getQuestionsByUserParamsSchema.parse(request.params);
    const questions = await questionService.getQuestionsByUserId(userId);
    return reply.send({ questions });
  }

  async createQuestion(
    request: FastifyRequest<{ Body: CreateQuestionInput }>,
    reply: FastifyReply
  ) {
    const data = createQuestionSchema.parse(request.body);
    const userId = (request.user as any).id;
    const question = await questionService.createQuestion(data, userId);

    return reply.status(201).send({
      message: 'Pergunta criada com sucesso',
      question,
    });
  }

  async createQuestionForUser(
    request: FastifyRequest<{ Params: GetQuestionsByUserParams; Body: CreateQuestionInput }>,
    reply: FastifyReply
  ) {
    const { userId } = getQuestionsByUserParamsSchema.parse(request.params);
    const data = createQuestionSchema.parse(request.body);
    const question = await questionService.createQuestion(data, userId);

    return reply.status(201).send({
      message: 'Pergunta criada com sucesso',
      question,
    });
  }

  async updateQuestion(
    request: FastifyRequest<{ Params: GetQuestionParams; Body: UpdateQuestionInput }>,
    reply: FastifyReply
  ) {
    const { id } = getQuestionParamsSchema.parse(request.params);
    const data = updateQuestionSchema.parse(request.body) as UpdateQuestionInput;
    const user = request.user as any;
    const userId = user.id;
    const isSuperUser = user.role === 'SUPER_USER';
    const question = await questionService.updateQuestion(id, data, userId, isSuperUser);

    return reply.send({
      message: 'Pergunta atualizada com sucesso',
      question,
    });
  }

  async reorderQuestions(
    request: FastifyRequest<{ Body: ReorderQuestionsInput }>,
    reply: FastifyReply
  ) {
    const data = reorderQuestionsSchema.parse(request.body);
    const user = request.user as any;
    const userId = user.id;
    const isSuperUser = user.role === 'SUPER_USER';
    const questions = await questionService.reorderQuestions(data, userId, isSuperUser);

    return reply.send({
      message: 'Perguntas reordenadas com sucesso',
      questions,
    });
  }

  async deleteQuestion(request: FastifyRequest<{ Params: GetQuestionParams }>, reply: FastifyReply) {
    const { id } = getQuestionParamsSchema.parse(request.params);
    const user = request.user as any;
    const userId = user.id;
    const isSuperUser = user.role === 'SUPER_USER';
    const result = await questionService.deleteQuestion(id, userId, isSuperUser);
    return reply.send(result);
  }
}

