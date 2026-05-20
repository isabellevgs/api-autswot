import type { FastifyInstance } from 'fastify';
import { FraquezasAmeacasChController } from './fraquezas-ameacas-ch.controller.js';

const fraquezasAmeacasChController = new FraquezasAmeacasChController();

const registroSchema = {
  type: 'object',
  properties: {
    id:          { type: 'string' },
    numeroTraco: { type: 'number' },
    numHistoria: { type: 'number' },
    frequencia:  { type: 'number', format: 'float' },
    intensidade: { type: 'number', format: 'float' },
    swot:        { type: 'string' },
  },
};

export async function fraquezasAmeacasChRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar
  fastify.get('/', {
    schema: {
      tags: ['fraquezas-ameacas-ch'],
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
  }, fraquezasAmeacasChController.listFraquezasAmeacasCh.bind(fraquezasAmeacasChController));

  // Obter por ID
  fastify.get('/:id', {
    schema: {
      tags: ['fraquezas-ameacas-ch'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      response: {
        200:  { type: 'object', properties: { registro: registroSchema } },
        404:  { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, fraquezasAmeacasChController.getFraquezasAmeacasCh.bind(fraquezasAmeacasChController));

  // Atualizar
  fastify.put('/:id', {
    schema: {
      tags: ['fraquezas-ameacas-ch'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      body: {
        type: 'object',
        properties: {
          numeroTraco: { type: 'number' }, numHistoria: { type: 'number' },
          frequencia:  { type: 'number' }, intensidade: { type: 'number' },
          swot:        { type: 'string' },
        },
      },
      response: {
        200: { type: 'object', properties: { registro: registroSchema } },
        404: { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, fraquezasAmeacasChController.updateFraquezasAmeacasCh.bind(fraquezasAmeacasChController));

  // Deletar
  fastify.delete('/:id', {
    schema: {
      tags: ['fraquezas-ameacas-ch'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, fraquezasAmeacasChController.deleteFraquezasAmeacasCh.bind(fraquezasAmeacasChController));
}
