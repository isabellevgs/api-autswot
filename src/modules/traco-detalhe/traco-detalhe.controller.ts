import type { FastifyRequest, FastifyReply } from 'fastify';
import { createTracoDetalheSchema, updateTracoDetalheSchema } from './traco-detalhe.schemas.js';
import * as service from './traco-detalhe.service.js';

export async function listar(_req: FastifyRequest, reply: FastifyReply) {
  const data = await service.listarTracosDetalhe();
  return reply.send(data);
}

export async function obter(
  req: FastifyRequest<{ Params: { tipo: string; numeroTraco: string } }>,
  reply: FastifyReply,
) {
  const detalhe = await service.obterTracoDetalhe(req.params.tipo, Number(req.params.numeroTraco));
  return reply.send(detalhe);
}

export async function criar(req: FastifyRequest, reply: FastifyReply) {
  const body = createTracoDetalheSchema.parse(req.body);
  const detalhe = await service.criarTracoDetalhe(body);
  return reply.status(201).send(detalhe);
}

export async function atualizar(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = updateTracoDetalheSchema.parse(req.body);
  const detalhe = await service.atualizarTracoDetalhe(req.params.id, body);
  return reply.send(detalhe);
}

export async function deletar(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const result = await service.deletarTracoDetalhe(req.params.id);
  return reply.send(result);
}
