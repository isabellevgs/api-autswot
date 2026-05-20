import type { FastifyInstance } from 'fastify';
import { FraquezasOportunidadesController } from './fraquezas-oportunidades.controller.js';

const fraquezasOportunidadesController = new FraquezasOportunidadesController();

const tracoItemSchema = {
  type: 'object',
  properties: { id: { type: 'string' }, valor: { type: 'string' } },
};

const registroSchema = {
  type: 'object',
  properties: {
    id:               { type: 'string' },
    numeroTraco:      { type: 'number' },
    pergunta:         { type: 'string' },
    explicacao:       { type: 'string' },
    swot:             { type: 'string' },
    tracoNeutro:      { type: 'array', items: tracoItemSchema },
    tracoOportunidade:{ type: 'array', items: tracoItemSchema },
    tracoFraqueza:    { type: 'array', items: tracoItemSchema },
  },
};

export async function fraquezasOportunidadesRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar
  fastify.get('/', {
    schema: {
      tags: ['fraquezas-oportunidades'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string' }, limit: { type: 'string' }, numeroTraco: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            registros:  { type: 'array', items: registroSchema },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' }, limit: { type: 'number' },
                total: { type: 'number' }, totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
  }, fraquezasOportunidadesController.listFraquezasOportunidades.bind(fraquezasOportunidadesController));

  // Obter por ID
  fastify.get('/:id', {
    schema: {
      tags: ['fraquezas-oportunidades'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      response: {
        200:  { type: 'object', properties: { registro: registroSchema } },
        404:  { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, fraquezasOportunidadesController.getFraquezasOportunidades.bind(fraquezasOportunidadesController));

  // Atualizar
  fastify.put('/:id', {
    schema: {
      tags: ['fraquezas-oportunidades'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      body: {
        type: 'object',
        properties: {
          numeroTraco: { type: 'number' },
          pergunta:    { type: 'string' },
          explicacao:  { type: 'string' },
          swot:        { type: 'string' },
        },
      },
      response: {
        200: { type: 'object', properties: { registro: registroSchema } },
        404: { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, fraquezasOportunidadesController.updateFraquezasOportunidades.bind(fraquezasOportunidadesController));

  // Deletar
  fastify.delete('/:id', {
    schema: {
      tags: ['fraquezas-oportunidades'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, fraquezasOportunidadesController.deleteFraquezasOportunidades.bind(fraquezasOportunidadesController));
}
