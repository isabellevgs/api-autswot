import type { FastifyRequest, FastifyReply } from 'fastify';
import { salvarPaginaJornadaSchema, salvarQuinzenaSchema } from './diario.schemas.js';
import * as service from './diario.service.js';

export async function listarPaginasJornada(req: FastifyRequest, reply: FastifyReply) {
  const data = await service.listarPaginasJornada(req.user.id);
  return reply.send({ paginas: data });
}

export async function obterPaginaJornada(
  req: FastifyRequest<{ Params: { chave: string } }>,
  reply: FastifyReply,
) {
  const pagina = await service.obterPaginaJornada(req.user.id, decodeURIComponent(req.params.chave));
  return reply.send({ pagina });
}

export async function salvarPaginaJornada(
  req: FastifyRequest<{ Params: { chave: string } }>,
  reply: FastifyReply,
) {
  const body = salvarPaginaJornadaSchema.parse(req.body);
  const pagina = await service.salvarPaginaJornada(
    req.user.id,
    decodeURIComponent(req.params.chave),
    body.texto,
    body.finalizar,
  );
  return reply.send({ pagina });
}

export async function listarQuinzenas(req: FastifyRequest, reply: FastifyReply) {
  const data = await service.listarQuinzenasAutoadvocacia(req.user.id);
  return reply.send({ quinzenas: data });
}

export async function criarQuinzena(req: FastifyRequest, reply: FastifyReply) {
  const quinzena = await service.criarQuinzenaAutoadvocacia(req.user.id);
  return reply.status(201).send({ quinzena });
}

export async function salvarQuinzena(
  req: FastifyRequest<{ Params: { numero: string } }>,
  reply: FastifyReply,
) {
  const body = salvarQuinzenaSchema.parse(req.body);
  const quinzena = await service.salvarQuinzenaAutoadvocacia(
    req.user.id,
    Number(req.params.numero),
    body.resposta1,
    body.resposta2,
    body.finalizar,
  );
  return reply.send({ quinzena });
}

export async function listarJornadaAdmin(
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
) {
  const paginas = await service.listarPaginasJornadaAdmin(req.params.userId);
  return reply.send({ paginas });
}

export async function listarAutoadvocaciaAdmin(
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
) {
  const quinzenas = await service.listarQuinzenasAutoadvocaciaAdmin(req.params.userId);
  return reply.send({ quinzenas });
}
