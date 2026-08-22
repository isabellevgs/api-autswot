import type { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataService, AppDataNotFoundError } from './app-data.service.js';
import type { AtualizarBloqueioAcessoInput } from './app-data.service.js';

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

  async getBloqueioAcesso(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await appDataService.getBloqueioAcesso();
      return reply.send(result);
    } catch (err) {
      if (err instanceof AppDataNotFoundError) {
        return reply.status(404).send({ error: err.message, code: 'APP_DATA_NOT_FOUND' });
      }
      throw err;
    }
  }

  async updateBloqueioAcesso(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as AtualizarBloqueioAcessoInput;
    const result = await appDataService.updateBloqueioAcesso(body);
    return reply.send({ message: 'Configuração de bloqueio de acesso atualizada com sucesso', ...result });
  }
}
