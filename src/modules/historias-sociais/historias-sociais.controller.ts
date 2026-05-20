import type { FastifyRequest, FastifyReply } from 'fastify';
import { HistoriasSociaisService } from './historias-sociais.service.js';
import {
  getHistoriasSociaisParamsSchema,
  listHistoriasSociaisQuerySchema,
  updateHistoriasSociaisSchema,
  type GetHistoriasSociaisParams,
  type ListHistoriasSociaisQuery,
  type UpdateHistoriasSociaisInput,
} from './historias-sociais.schemas.js';

const historiasSociaisService = new HistoriasSociaisService();

export class HistoriasSociaisController {
  async getHistoriasSociais(
    request: FastifyRequest<{ Params: GetHistoriasSociaisParams }>,
    reply: FastifyReply
  ) {
    const { id } = getHistoriasSociaisParamsSchema.parse(request.params);
    const registro = await historiasSociaisService.getHistoriasSociaisById(id);
    return reply.send({ registro });
  }

  async listHistoriasSociais(
    request: FastifyRequest<{ Querystring: ListHistoriasSociaisQuery }>,
    reply: FastifyReply
  ) {
    const { page = 1, limit = 10, numeroHistoria } = listHistoriasSociaisQuerySchema.parse(
      request.query
    );
    const result = await historiasSociaisService.listHistoriasSociais(page, limit, numeroHistoria);
    return reply.send(result);
  }

  async updateHistoriasSociais(
    request: FastifyRequest<{ Params: GetHistoriasSociaisParams; Body: UpdateHistoriasSociaisInput }>,
    reply: FastifyReply
  ) {
    const { id } = getHistoriasSociaisParamsSchema.parse(request.params);
    const data = updateHistoriasSociaisSchema.parse(request.body);
    const registro = await historiasSociaisService.updateHistoriasSociais(id, data);
    return reply.send({ registro });
  }

  async deleteHistoriasSociais(
    request: FastifyRequest<{ Params: GetHistoriasSociaisParams }>,
    reply: FastifyReply
  ) {
    const { id } = getHistoriasSociaisParamsSchema.parse(request.params);
    await historiasSociaisService.deleteHistoriasSociais(id);
    return reply.send({ message: 'Registro deletado com sucesso' });
  }
}

