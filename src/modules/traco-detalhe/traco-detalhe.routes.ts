import type { FastifyInstance } from 'fastify';
import * as controller from './traco-detalhe.controller.js';

const detalheSchema = {
  type: 'object',
  properties: {
    id:               { type: 'string' },
    tipo:             { type: 'string' },
    numeroTraco:      { type: 'number' },
    titulo:           { type: 'string' },
    oQueE:            { type: 'array', items: { type: 'string' } },
    comoUsar:         { type: 'array', items: { type: 'string' } },
    comoOportunidade: { type: 'array', items: { type: 'string' } },
    comoAtrapalhar:   { type: 'array', items: { type: 'string' } },
    reduzirImpacto:   { type: 'array', items: { type: 'string' } },
    dicas:            { type: 'array', items: { type: 'string' } },
    exemplos:         { type: 'array', items: { type: 'string' } },
    createdAt:        { type: 'string' },
    updatedAt:        { type: 'string' },
  },
};

export async function tracoDetalheRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // App: busca por tipo + numeroTraco
  fastify.get('/:tipo/:numeroTraco', {
    schema: { response: { 200: detalheSchema } },
    handler: controller.obter,
  });

  // Admin: listar todos
  fastify.get('/', {
    schema: { response: { 200: { type: 'array', items: detalheSchema } } },
    handler: controller.listar,
  });

  // Admin: criar (requer SUPER_USER)
  fastify.post('/', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: { response: { 201: detalheSchema } },
    handler: controller.criar,
  });

  // Admin: atualizar (requer SUPER_USER)
  fastify.put('/:id', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: { response: { 200: detalheSchema } },
    handler: controller.atualizar,
  });

  // Admin: deletar (requer SUPER_USER)
  fastify.delete('/:id', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    handler: controller.deletar,
  });
}
