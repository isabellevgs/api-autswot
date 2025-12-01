import type { FastifyRequest, FastifyReply } from 'fastify';
import { FraquezasAmeacasShService } from './fraquezas-ameacas-sh.service.js';
import {
  getFraquezasAmeacasShParamsSchema,
  listFraquezasAmeacasShQuerySchema,
  type GetFraquezasAmeacasShParams,
  type ListFraquezasAmeacasShQuery,
} from './fraquezas-ameacas-sh.schemas.js';

const fraquezasAmeacasShService = new FraquezasAmeacasShService();

export class FraquezasAmeacasShController {
  async getFraquezasAmeacasSh(
    request: FastifyRequest<{ Params: GetFraquezasAmeacasShParams }>,
    reply: FastifyReply
  ) {
    const { id } = getFraquezasAmeacasShParamsSchema.parse(request.params);
    const registro = await fraquezasAmeacasShService.getFraquezasAmeacasShById(id);
    return reply.send({ registro });
  }

  async listFraquezasAmeacasSh(
    request: FastifyRequest<{ Querystring: ListFraquezasAmeacasShQuery }>,
    reply: FastifyReply
  ) {
    const { page = 1, limit = 10, numeroTraco } = listFraquezasAmeacasShQuerySchema.parse(
      request.query
    );
    const result = await fraquezasAmeacasShService.listFraquezasAmeacasSh(
      page,
      limit,
      numeroTraco
    );
    return reply.send(result);
  }
}

