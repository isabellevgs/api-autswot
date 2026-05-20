import type { FastifyRequest, FastifyReply } from 'fastify';
import { ForcasService } from './forcas.service.js';
import {
  getForcasParamsSchema,
  listForcasQuerySchema,
  createForcasSchema,
  updateForcasSchema,
  type GetForcasParams,
  type ListForcasQuery,
  type UpdateForcasParams,
  type DeleteForcasParams,
} from './forcas.schemas.js';

const forcasService = new ForcasService();

export class ForcasController {
  async getForcas(request: FastifyRequest<{ Params: GetForcasParams }>, reply: FastifyReply) {
    const { id } = getForcasParamsSchema.parse(request.params);
    const registro = await forcasService.getForcasById(id);
    return reply.send({ registro });
  }

  async listForcas(request: FastifyRequest<{ Querystring: ListForcasQuery }>, reply: FastifyReply) {
    const { page, limit, numeroTraco } = listForcasQuerySchema.parse(request.query);
    const result = await forcasService.listForcas(page, limit, numeroTraco);
    return reply.send(result);
  }

  async createForcas(request: FastifyRequest, reply: FastifyReply) {
    const data = createForcasSchema.parse(request.body);
    const registro = await forcasService.createForcas(data);
    return reply.status(201).send({ registro });
  }

  async updateForcas(
    request: FastifyRequest<{ Params: UpdateForcasParams }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const data = updateForcasSchema.parse(request.body);
    const registro = await forcasService.updateForcas(id, data);
    return reply.send({ registro });
  }

  async deleteForcas(
    request: FastifyRequest<{ Params: DeleteForcasParams }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    await forcasService.deleteForcas(id);
    return reply.send({ message: 'Registro deletado com sucesso' });
  }
}
