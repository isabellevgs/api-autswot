import type { FastifyInstance } from 'fastify';
import * as controller from './reflexao-traco.controller.js';

const respostasSchema = {
  type: 'object',
  additionalProperties: { type: 'string' },
};

const reflexaoSchema = {
  type: 'object',
  properties: {
    id:          { type: 'string' },
    userId:      { type: 'string' },
    tipo:        { type: 'string' },
    numeroTraco: { type: 'number' },
    quadrante:   { type: 'string' },
    respostas:   respostasSchema,
    createdAt:   { type: 'string' },
    updatedAt:   { type: 'string' },
  },
};

const progressoSchema = {
  type: 'object',
  additionalProperties: {
    type: 'object',
    properties: {
      concluidos:   { type: 'number' },
      necessarios:  { type: 'number' },
      desbloqueado: { type: 'boolean' },
    },
  },
};

export async function reflexaoTracoRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', {
    schema: { response: { 200: { type: 'array', items: reflexaoSchema } } },
    handler: controller.listar,
  });

  // Rota de progresso deve vir ANTES da rota parametrizada /:tipo/...
  fastify.get('/progresso', {
    schema: { response: { 200: progressoSchema } },
    handler: controller.progresso,
  });

  fastify.get('/:tipo/:numeroTraco/:quadrante', {
    schema: { response: { 200: reflexaoSchema } },
    handler: controller.obter,
  });

  fastify.post('/', {
    schema: { response: { 200: reflexaoSchema } },
    handler: controller.salvar,
  });

  // Admin: lista todas as reflexões de um usuário específico (requer SUPER_USER)
  fastify.get('/user/:userId', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ...reflexaoSchema.properties,
              titulo: { type: 'string', nullable: true },
            },
            additionalProperties: false,
          },
        },
      },
    },
    handler: controller.listarPorUsuarioAdmin,
  });
}
