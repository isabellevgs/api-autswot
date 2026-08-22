import type { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataService, AppDataNotFoundError } from './app-data.service.js';
import type { AtualizarBloqueioAcessoInput } from './app-data.service.js';
import { UserService } from '../user/user.service.js';

const appDataService = new AppDataService();
const userService = new UserService();

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

  async getTermoUso(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await appDataService.getTermoUso();
      return reply.send(result);
    } catch (err) {
      if (err instanceof AppDataNotFoundError) {
        return reply.status(404).send({ error: err.message, code: 'TERMO_USO_NOT_FOUND' });
      }
      throw err;
    }
  }  

  async updateTcle(request: FastifyRequest, reply: FastifyReply) {
    const { tcle } = request.body as { tcle: string };
    const result = await appDataService.updateTcle(tcle);
    return reply.send({ message: 'TCLE atualizado com sucesso', tcle: result.tcle });
  }

  async updateTermoUso(request: FastifyRequest, reply: FastifyReply) {
    const { termoUso } = request.body as { termoUso: string };
    const result = await appDataService.updateTermoUso(termoUso);
    return reply.send({ message: 'Termo de uso atualizado com sucesso', termoUso: result.termoUso });
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

  async getAcessoLiberado(emailUsuario: string) {
    const appData = await this.repository.get();
    if (!appData) {
      throw new AppDataNotFoundError();
    }
  
    if (!appData.bloquearAcesso) {
      return { acessoLiberado: true };
    }
  
    const temData = !!appData.dataInicioAcesso && !!appData.dataFimAcesso;
    const temEmail = appData.emailsComAcesso.length > 0;
  
    if (!temData && !temEmail) {
      return { acessoLiberado: false };
    }
  
    const agora = new Date();
    const dentroDoPeriodo =
      temData &&
      agora >= appData.dataInicioAcesso! &&
      agora <= appData.dataFimAcesso!;
  
    const emailAutorizado = appData.emailsComAcesso.some(
      (email) => email.toLowerCase() === emailUsuario.toLowerCase(),
    );
  
    if (temData && temEmail) {
      return { acessoLiberado: dentroDoPeriodo && emailAutorizado };
    }
    if (temData) {
      return { acessoLiberado: dentroDoPeriodo };
    }
    return { acessoLiberado: emailAutorizado };
  }

  async updateBloqueioAcesso(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as AtualizarBloqueioAcessoInput;
    const result = await appDataService.updateBloqueioAcesso(body);
    return reply.send({ message: 'Configuração de bloqueio de acesso atualizada com sucesso', ...result });
  }
}
