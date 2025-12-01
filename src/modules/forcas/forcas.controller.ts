import type { FastifyRequest, FastifyReply } from 'fastify';
import { ForcasService } from './forcas.service.js';
import {
  getForcasParamsSchema,
  listForcasQuerySchema,
  type GetForcasParams,
  type ListForcasQuery,
} from './forcas.schemas.js';

const forcasService = new ForcasService();

export class ForcasController {
  async getForcas(
    request: FastifyRequest<{ Params: GetForcasParams }>,
    reply: FastifyReply
  ) {
    const { id } = getForcasParamsSchema.parse(request.params);
    const registro = await forcasService.getForcasById(id);
    return reply.send({ registro });
  }

  async listForcas(
    request: FastifyRequest<{ Querystring: ListForcasQuery }>,
    reply: FastifyReply
  ) {
    const { page = 1, limit = 10, numeroTraco } = listForcasQuerySchema.parse(
      request.query
    );
    const result = await forcasService.listForcas(
      page,
      limit,
      numeroTraco
    );
    return reply.send(result);
  }
}

