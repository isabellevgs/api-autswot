import type { FastifyRequest, FastifyReply } from 'fastify';
import { FraquezasAmeacasChService } from './fraquezas-ameacas-ch.service.js';
import {
  getFraquezasAmeacasChParamsSchema,
  listFraquezasAmeacasChQuerySchema,
  updateFraquezasAmeacasChSchema,
  type GetFraquezasAmeacasChParams,
  type ListFraquezasAmeacasChQuery,
  type UpdateFraquezasAmeacasChInput,
} from './fraquezas-ameacas-ch.schemas.js';

const fraquezasAmeacasChService = new FraquezasAmeacasChService();

export class FraquezasAmeacasChController {
  async getFraquezasAmeacasCh(
    request: FastifyRequest<{ Params: GetFraquezasAmeacasChParams }>,
    reply: FastifyReply
  ) {
    const { id } = getFraquezasAmeacasChParamsSchema.parse(request.params);
    const registro = await fraquezasAmeacasChService.getFraquezasAmeacasChById(id);
    return reply.send({ registro });
  }

  async listFraquezasAmeacasCh(
    request: FastifyRequest<{ Querystring: ListFraquezasAmeacasChQuery }>,
    reply: FastifyReply
  ) {
    const { page = 1, limit = 10, numeroTraco } = listFraquezasAmeacasChQuerySchema.parse(request.query);
    const result = await fraquezasAmeacasChService.listFraquezasAmeacasCh(page, limit, numeroTraco);
    return reply.send(result);
  }

  async updateFraquezasAmeacasCh(
    request: FastifyRequest<{ Params: GetFraquezasAmeacasChParams; Body: UpdateFraquezasAmeacasChInput }>,
    reply: FastifyReply
  ) {
    const { id } = getFraquezasAmeacasChParamsSchema.parse(request.params);
    const data = updateFraquezasAmeacasChSchema.parse(request.body);
    const registro = await fraquezasAmeacasChService.updateFraquezasAmeacasCh(id, data);
    return reply.send({ registro });
  }

  async deleteFraquezasAmeacasCh(
    request: FastifyRequest<{ Params: GetFraquezasAmeacasChParams }>,
    reply: FastifyReply
  ) {
    const { id } = getFraquezasAmeacasChParamsSchema.parse(request.params);
    await fraquezasAmeacasChService.deleteFraquezasAmeacasCh(id);
    return reply.send({ message: 'Registro deletado com sucesso' });
  }
}
