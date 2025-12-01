import type { FastifyRequest, FastifyReply } from 'fastify';
import { QuestionarioRespostaService } from './questionario-resposta.service.js';
import {
  salvarRespostaSchema,
  salvarRespostasSchema,
  getRespostaParamsSchema,
  listRespostasQuerySchema,
  type SalvarRespostaInput,
  type SalvarRespostasInput,
  type GetRespostaParams,
  type ListRespostasQuery,
} from './questionario-resposta.schemas.js';

const service = new QuestionarioRespostaService();

export class QuestionarioRespostaController {
  async getResposta(
    request: FastifyRequest<{ Params: GetRespostaParams }>,
    reply: FastifyReply
  ) {
    const { id } = getRespostaParamsSchema.parse(request.params);
    const resposta = await service.getRespostaById(id);
    return reply.send({ resposta });
  }

  async listRespostas(
    request: FastifyRequest<{ Querystring: ListRespostasQuery }>,
    reply: FastifyReply
  ) {
    const userId = request.user.id;
    const { tipo } = listRespostasQuerySchema.parse(request.query);
    const respostas = await service.listRespostasByUserId(userId, tipo);
    return reply.send({ respostas });
  }

  async salvarResposta(
    request: FastifyRequest<{ Body: SalvarRespostaInput }>,
    reply: FastifyReply
  ) {
    const userId = request.user.id;
    const data = salvarRespostaSchema.parse(request.body);
    const resposta = await service.salvarResposta(userId, data);
    return reply.status(201).send({
      message: 'Resposta salva com sucesso',
      resposta,
    });
  }

  async salvarRespostas(
    request: FastifyRequest<{ Body: SalvarRespostasInput }>,
    reply: FastifyReply
  ) {
    const userId = request.user.id;
    const { respostas } = salvarRespostasSchema.parse(request.body);
    const result = await service.salvarRespostas(userId, respostas);
    return reply.status(201).send({
      message: `${result.count} resposta(s) salva(s) com sucesso`,
      count: result.count,
    });
  }

  async deletarResposta(
    request: FastifyRequest<{ Params: GetRespostaParams }>,
    reply: FastifyReply
  ) {
    const { id } = getRespostaParamsSchema.parse(request.params);
    await service.deletarResposta(id);
    return reply.send({
      message: 'Resposta deletada com sucesso',
    });
  }

  async obterSwotCompleto(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const userId = request.user.id;
    console.log('[DEBUG controller] obterSwotCompleto chamado com userId:', userId);
    const swot = await service.obterSwotCompleto(userId);
    console.log('[DEBUG controller] SWOT retornado:', {
      forcas: swot.forcas.length,
      fraquezas: swot.fraquezas.length,
      oportunidades: swot.oportunidades.length,
      ameacas: swot.ameacas.length
    });
    return reply.send(swot);
  }
}

