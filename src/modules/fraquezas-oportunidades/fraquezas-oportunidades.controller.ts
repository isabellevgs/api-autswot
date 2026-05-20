import type { FastifyRequest, FastifyReply } from 'fastify';
import { FraquezasOportunidadesService } from './fraquezas-oportunidades.service.js';
import {
  getFraquezasOportunidadesParamsSchema,
  listFraquezasOportunidadesQuerySchema,
  updateFraquezasOportunidadesSchema,
  type GetFraquezasOportunidadesParams,
  type ListFraquezasOportunidadesQuery,
  type UpdateFraquezasOportunidadesInput,
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
    const { page = 1, limit = 10, numeroTraco } = listFraquezasOportunidadesQuerySchema.parse(request.query);
    const result = await fraquezasOportunidadesService.listFraquezasOportunidades(page, limit, numeroTraco);
    return reply.send(result);
  }

  async updateFraquezasOportunidades(
    request: FastifyRequest<{ Params: GetFraquezasOportunidadesParams; Body: UpdateFraquezasOportunidadesInput }>,
    reply: FastifyReply
  ) {
    const { id } = getFraquezasOportunidadesParamsSchema.parse(request.params);
    const data = updateFraquezasOportunidadesSchema.parse(request.body);
    const registro = await fraquezasOportunidadesService.updateFraquezasOportunidades(id, data);
    return reply.send({ registro });
  }

  async deleteFraquezasOportunidades(
    request: FastifyRequest<{ Params: GetFraquezasOportunidadesParams }>,
    reply: FastifyReply
  ) {
    const { id } = getFraquezasOportunidadesParamsSchema.parse(request.params);
    await fraquezasOportunidadesService.deleteFraquezasOportunidades(id);
    return reply.send({ message: 'Registro deletado com sucesso' });
  }
}
