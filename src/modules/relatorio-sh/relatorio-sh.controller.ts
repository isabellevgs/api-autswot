import type { FastifyRequest, FastifyReply } from 'fastify';
import { createRelatorioShSchema, updateRelatorioShSchema } from './relatorio-sh.schemas.js';
import * as service from './relatorio-sh.service.js';

export async function listar(_req: FastifyRequest, reply: FastifyReply) {
  const data = await service.listarRelatoriosSh();
  return reply.send(data);
}

export async function obter(
  req: FastifyRequest<{ Params: { numeroTraco: string } }>,
  reply: FastifyReply,
) {
  const relatorio = await service.obterRelatorioSh(Number(req.params.numeroTraco));
  return reply.send(relatorio);
}

export async function obterPorId(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const relatorio = await service.obterRelatorioShPorId(req.params.id);
  return reply.send(relatorio);
}

export async function criar(req: FastifyRequest, reply: FastifyReply) {
  const body = createRelatorioShSchema.parse(req.body);
  const relatorio = await service.criarRelatorioSh(body);
  return reply.status(201).send(relatorio);
}

export async function atualizar(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = updateRelatorioShSchema.parse(req.body);
  const relatorio = await service.atualizarRelatorioSh(req.params.id, body);
  return reply.send(relatorio);
}

export async function deletar(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const result = await service.deletarRelatorioSh(req.params.id);
  return reply.send(result);
}
