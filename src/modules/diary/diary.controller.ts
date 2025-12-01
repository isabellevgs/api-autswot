import type { FastifyRequest, FastifyReply } from 'fastify';
import { DiaryService } from './diary.service.js';
import {
  createDiaryEntrySchema,
  updateDiaryEntrySchema,
  getDiaryEntryParamsSchema,
  getDiaryEntriesByUserParamsSchema,
  getDiaryEntryByDateParamsSchema,
  type CreateDiaryEntryInput,
  type UpdateDiaryEntryInput,
  type GetDiaryEntryParams,
  type GetDiaryEntriesByUserParams,
  type GetDiaryEntryByDateParams,
} from './diary.schemas.js';

const diaryService = new DiaryService();

export class DiaryController {
  async getDiaryEntry(
    request: FastifyRequest<{ Params: GetDiaryEntryParams }>,
    reply: FastifyReply
  ) {
    const { id } = getDiaryEntryParamsSchema.parse(request.params);
    const userId = (request.user as any).id;
    const isSuperUser = (request.user as any).role === 'SUPER_USER';
    const entry = await diaryService.getDiaryEntryById(id, userId, isSuperUser);
    return reply.send({ entry });
  }

  async getDiaryEntriesByUser(
    request: FastifyRequest<{ Params: GetDiaryEntriesByUserParams }>,
    reply: FastifyReply
  ) {
    const { userId } = getDiaryEntriesByUserParamsSchema.parse(request.params);
    const requestingUserId = (request.user as any).id;
    const isSuperUser = (request.user as any).role === 'SUPER_USER';
    const entries = await diaryService.getDiaryEntriesByUserId(
      userId,
      requestingUserId,
      isSuperUser
    );
    return reply.send({ entries });
  }

  async getDiaryEntryByDate(
    request: FastifyRequest<{ Params: GetDiaryEntryByDateParams }>,
    reply: FastifyReply
  ) {
    const { userId, date } = getDiaryEntryByDateParamsSchema.parse(request.params);
    const requestingUserId = (request.user as any).id;
    const isSuperUser = (request.user as any).role === 'SUPER_USER';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const entry = await diaryService.getDiaryEntryByDate(
      userId,
      dateObj,
      requestingUserId,
      isSuperUser
    );
    return reply.send({ entry });
  }

  async createDiaryEntry(
    request: FastifyRequest<{ Body: CreateDiaryEntryInput }>,
    reply: FastifyReply
  ) {
    const data = createDiaryEntrySchema.parse(request.body);
    const userId = (request.user as any).id;
    const entry = await diaryService.createDiaryEntry(data, userId);

    return reply.status(201).send({
      message: 'Entrada do diário criada com sucesso',
      entry,
    });
  }

  async updateDiaryEntry(
    request: FastifyRequest<{ Params: GetDiaryEntryParams; Body: UpdateDiaryEntryInput }>,
    reply: FastifyReply
  ) {
    const { id } = getDiaryEntryParamsSchema.parse(request.params);
    const data = updateDiaryEntrySchema.parse(request.body);
    const userId = (request.user as any).id;
    const isSuperUser = (request.user as any).role === 'SUPER_USER';
    const entry = await diaryService.updateDiaryEntry(id, data, userId, isSuperUser);

    return reply.send({
      message: 'Entrada do diário atualizada com sucesso',
      entry,
    });
  }

  async deleteDiaryEntry(
    request: FastifyRequest<{ Params: GetDiaryEntryParams }>,
    reply: FastifyReply
  ) {
    const { id } = getDiaryEntryParamsSchema.parse(request.params);
    const userId = (request.user as any).id;
    const isSuperUser = (request.user as any).role === 'SUPER_USER';
    await diaryService.deleteDiaryEntry(id, userId, isSuperUser);

    return reply.send({
      message: 'Entrada do diário deletada com sucesso',
    });
  }
}

