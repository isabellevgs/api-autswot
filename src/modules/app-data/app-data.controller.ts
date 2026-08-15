import type { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataService, AppDataNotFoundError } from './app-data.service.js';

const appDataService = new AppDataService();

export class AppDataController {
  async getTcle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await appDataService.getTcle();
      return reply.send(result);
    } catch (err) {
      if (err instanceof AppDataNotFoundError) {
        return reply.status(404).send({ error: err.message, code: 'TCLE_NOT_FOUND' });
      }
      throw err;
    }
  }

  async updateTcle(request: FastifyRequest, reply: FastifyReply) {
    const { tcle } = request.body as { tcle: string };
    const result = await appDataService.updateTcle(tcle);
    return reply.send({ message: 'TCLE atualizado com sucesso', tcle: result.tcle });
  }
}
