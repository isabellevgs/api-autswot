import type { FastifyInstance } from 'fastify';
import { relatorioAmeacaJsonSchema } from '../relatorio-ameaca/relatorio-ameaca.schemas.js';
import * as controller from './relatorio-ch.controller.js';

export async function relatorioChRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', {
    schema: {
      description: 'Listar relatórios CH (leitura permitida a usuários autenticados do app)',
      response: { 200: { type: 'array', items: relatorioAmeacaJsonSchema } },
    },
    handler: controller.listar,
  });

  fastify.get('/:numeroTraco', {
    schema: {
      description: 'Obter relatório CH por traço (leitura permitida a usuários autenticados do app)',
      response: { 200: relatorioAmeacaJsonSchema },
    },
    handler: controller.obter,
  });

  fastify.post('/', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: { response: { 201: relatorioAmeacaJsonSchema } },
    handler: controller.criar,
  });

  fastify.put('/:id', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: { response: { 200: relatorioAmeacaJsonSchema } },
    handler: controller.atualizar,
  });

  fastify.delete('/:id', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    handler: controller.deletar,
  });
}
