import type { FastifyRequest, FastifyReply } from 'fastify';
import { createRelatorioAmeacaSchema, updateRelatorioAmeacaSchema } from '../relatorio-ameaca/relatorio-ameaca.schemas.js';
import * as service from './relatorio-ch.service.js';

export async function listar(_req: FastifyRequest, reply: FastifyReply) {
  return reply.send(await service.listarRelatoriosCh());
}

export async function obter(
  req: FastifyRequest<{ Params: { numeroTraco: string } }>,
  reply: FastifyReply,
) {
  return reply.send(await service.obterRelatorioCh(Number(req.params.numeroTraco)));
}

export async function criar(req: FastifyRequest, reply: FastifyReply) {
  const body = createRelatorioAmeacaSchema.parse(req.body);
  return reply.status(201).send(await service.criarRelatorioCh(body));
}

export async function atualizar(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = updateRelatorioAmeacaSchema.parse(req.body);
  return reply.send(await service.atualizarRelatorioCh(req.params.id, body));
}

export async function deletar(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  return reply.send(await service.deletarRelatorioCh(req.params.id));
}
