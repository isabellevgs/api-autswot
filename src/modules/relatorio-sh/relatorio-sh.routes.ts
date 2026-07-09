import type { FastifyInstance } from 'fastify';
import * as controller from './relatorio-sh.controller.js';

const relatorioSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    numeroTraco: { type: 'number' },
    titulo: { type: 'string' },
    oQueE: { type: 'array', items: { type: 'string' } },
    atrapalharAcademico: { type: 'string' },
    atrapalharProfissional: { type: 'string' },
    atrapalharFamiliar: { type: 'string' },
    atrapalharAmigosColegas: { type: 'string' },
    atrapalharParceiros: { type: 'string' },
    reduzirImpacto: { type: 'array', items: { type: 'string' } },
    dicas: { type: 'array', items: { type: 'string' } },
    exemplos: { type: 'array', items: { type: 'string' } },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
};

export async function relatorioShRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', {
    schema: {
      description: 'Listar relatórios SH (leitura permitida a usuários autenticados do app)',
      response: { 200: { type: 'array', items: relatorioSchema } },
    },
    handler: controller.listar,
  });

  fastify.get('/:numeroTraco', {
    schema: {
      description: 'Obter relatório SH por traço (leitura permitida a usuários autenticados do app)',
      response: { 200: relatorioSchema },
    },
    handler: controller.obter,
  });

  fastify.post('/', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: { response: { 201: relatorioSchema } },
    handler: controller.criar,
  });

  fastify.put('/:id', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: { response: { 200: relatorioSchema } },
    handler: controller.atualizar,
  });

  fastify.delete('/:id', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    handler: controller.deletar,
  });
}
