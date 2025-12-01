import type { FastifyRequest, FastifyReply } from 'fastify';
import { FraquezasOportunidadesService } from './fraquezas-oportunidades.service.js';
import {
  getFraquezasOportunidadesParamsSchema,
  listFraquezasOportunidadesQuerySchema,
  type GetFraquezasOportunidadesParams,
  type ListFraquezasOportunidadesQuery,
} from './fraquezas-oportunidades.schemas.js';

const fraquezasOportunidadesService = new FraquezasOportunidadesService();

export class FraquezasOportunidadesController {
  async getFraquezasOportunidades(
    request: FastifyRequest<{ Params: GetFraquezasOportunidadesParams }>,
    reply: FastifyReply
  ) {
    const { id } = getFraquezasOportunidadesParamsSchema.parse(request.params);
    const registro = await fraquezasOportunidadesService.getFraquezasOportunidadesById(id);
    return reply.send({ registro });
  }

  async listFraquezasOportunidades(
    request: FastifyRequest<{ Querystring: ListFraquezasOportunidadesQuery }>,
    reply: FastifyReply
  ) {
    const { page = 1, limit = 10, numeroTraco } = listFraquezasOportunidadesQuerySchema.parse(
      request.query
    );
    const result = await fraquezasOportunidadesService.listFraquezasOportunidades(
      page,
      limit,
      numeroTraco
    );
    return reply.send(result);
  }
}

