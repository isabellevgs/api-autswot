import type { FastifyRequest, FastifyReply } from 'fastify';
import { upsertReflexaoSchema } from './reflexao-traco.schemas.js';
import * as service from './reflexao-traco.service.js';

export async function obter(
  req: FastifyRequest<{ Params: { tipo: string; numeroTraco: string; quadrante: string } }>,
  reply: FastifyReply,
) {
  const userId = req.user.id;
  const reflexao = await service.obterReflexao(userId, req.params.tipo, Number(req.params.numeroTraco), req.params.quadrante);
  return reply.send(reflexao ?? { respostas: {} });
}

export async function listar(req: FastifyRequest, reply: FastifyReply) {
  const data = await service.listarReflexoesDoUsuario(req.user.id);
  return reply.send(data);
}

export async function salvar(req: FastifyRequest, reply: FastifyReply) {
  const body = upsertReflexaoSchema.parse(req.body);
  const reflexao = await service.salvarReflexao(req.user.id, body);
  return reply.send(reflexao);
}

export async function progresso(req: FastifyRequest, reply: FastifyReply) {
  const data = await service.obterProgressoQuadrantes(req.user.id);
  return reply.send(data);
}

export async function listarPorUsuarioAdmin(
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
) {
  const data = await service.listarReflexoesParaAdmin(req.params.userId);
  return reply.send(data);
}
