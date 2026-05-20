import type { FastifyInstance } from 'fastify';
import { ForcasController } from './forcas.controller.js';

const forcasController = new ForcasController();

const tracoItemSchema = {
  type: 'object',
  properties: { id: { type: 'string' }, valor: { type: 'string' } },
};

const registroSchema = {
  type: 'object',
  properties: {
    id:                { type: 'string' },
    numeroTraco:       { type: 'number' },
    pergunta:          { type: 'string' },
    exemplo:           { type: 'string' },
    swot:              { type: 'string' },
    tracoNeutro:       { type: 'array', items: tracoItemSchema },
    tracoForca:        { type: 'array', items: tracoItemSchema },
    tracoFraqueza:     { type: 'array', items: tracoItemSchema },
    tracoOportunidade: { type: 'array', items: tracoItemSchema },
  },
};

export async function forcasRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar
  fastify.get('/', {
    schema: {
      tags: ['forcas'],
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
  }, forcasController.listForcas.bind(forcasController));

  // Obter por ID
  fastify.get('/:id', {
    schema: {
      tags: ['forcas'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      response: {
        200:  { type: 'object', properties: { registro: registroSchema } },
        404:  { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, forcasController.getForcas.bind(forcasController));

  // Criar
  fastify.post('/', {
    schema: {
      tags: ['forcas'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['numeroTraco', 'pergunta'],
        properties: {
          numeroTraco:       { type: 'number' },
          pergunta:          { type: 'string' },
          exemplo:           { type: 'string' },
          swot:              { type: 'string' },
          tracoNeutro:       { type: 'array', items: { type: 'string' } },
          tracoForca:        { type: 'array', items: { type: 'string' } },
          tracoFraqueza:     { type: 'array', items: { type: 'string' } },
          tracoOportunidade: { type: 'array', items: { type: 'string' } },
        },
      },
      response: {
        201: { type: 'object', properties: { registro: registroSchema } },
      },
    },
  }, forcasController.createForcas.bind(forcasController));

  // Atualizar
  fastify.put('/:id', {
    schema: {
      tags: ['forcas'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      body: {
        type: 'object',
        properties: {
          numeroTraco:       { type: 'number' },
          pergunta:          { type: 'string' },
          exemplo:           { type: 'string' },
          swot:              { type: 'string' },
          tracoNeutro:       { type: 'array', items: { type: 'string' } },
          tracoForca:        { type: 'array', items: { type: 'string' } },
          tracoFraqueza:     { type: 'array', items: { type: 'string' } },
          tracoOportunidade: { type: 'array', items: { type: 'string' } },
        },
      },
      response: {
        200: { type: 'object', properties: { registro: registroSchema } },
        404: { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, forcasController.updateForcas.bind(forcasController));

  // Deletar
  fastify.delete('/:id', {
    schema: {
      tags: ['forcas'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, forcasController.deleteForcas.bind(forcasController));
}
