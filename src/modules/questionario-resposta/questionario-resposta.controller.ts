import type { FastifyRequest, FastifyReply } from 'fastify';
import { QuestionarioRespostaService } from './questionario-resposta.service.js';
import { ForbiddenError } from '../../utils/errors.js';
import { assertSuperUserOrOwner, isSuperUser } from '../../utils/authorization.js';
import {
  parseSalvarRespostaInput,
  parseSalvarRespostasInput,
  getRespostaParamsSchema,
  listRespostasQuerySchema,
  listRespostasByUserIdParamsSchema,
  listRespostasByUserIdQuerySchema,
  type SalvarRespostaInput,
  type SalvarRespostasInput,
  type GetRespostaParams,
  type ListRespostasQuery,
  type ListRespostasByUserIdParams,
  type ListRespostasByUserIdQuery,
} from './questionario-resposta.schemas.js';

const service = new QuestionarioRespostaService();

export class QuestionarioRespostaController {
  async getResposta(
    request: FastifyRequest<{ Params: GetRespostaParams }>,
    reply: FastifyReply
  ) {
    const { id } = getRespostaParamsSchema.parse(request.params);
    const resposta = await service.getRespostaById(id);
    assertSuperUserOrOwner(request.user, resposta.userId);
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
    const data = await parseSalvarRespostaInput(request.body);
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
    const { respostas } = await parseSalvarRespostasInput(request.body);
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
    const resposta = await service.getRespostaById(id);
    assertSuperUserOrOwner(request.user, resposta.userId, 'Você não tem permissão para deletar esta resposta.');
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
    const swot = await service.obterSwotCompleto(userId);
    return reply.send(swot);
  }

  async obterSwotByUserId(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    if (!isSuperUser(request.user.role)) {
      throw new ForbiddenError('Apenas super usuários podem visualizar SWOT de outros usuários');
    }

    const { userId } = request.params;
    const swot = await service.obterSwotCompleto(userId);
    return reply.send(swot);
  }

  async listRespostasByUserId(
    request: FastifyRequest<{ 
      Params: ListRespostasByUserIdParams;
      Querystring: ListRespostasByUserIdQuery;
    }>,
    reply: FastifyReply
  ) {
    if (!isSuperUser(request.user.role)) {
      throw new ForbiddenError('Apenas super usuários podem visualizar respostas de outros usuários');
    }

    const { userId } = listRespostasByUserIdParamsSchema.parse(request.params);
    const { tipo } = listRespostasByUserIdQuerySchema.parse(request.query);
    const respostas = await service.listRespostasByUserId(userId, tipo);
    return reply.send({ respostas });
  }
}
