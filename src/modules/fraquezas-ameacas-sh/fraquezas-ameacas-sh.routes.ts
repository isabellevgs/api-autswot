import type { FastifyInstance } from 'fastify';
import { FraquezasAmeacasShController } from './fraquezas-ameacas-sh.controller.js';

const fraquezasAmeacasShController = new FraquezasAmeacasShController();

const registroSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    numeroTraco: { type: 'number' },
    pergunta: { type: 'string' },
    explicacao: { type: 'string' },
    swot: { type: 'string' },
    frequencia: { type: 'number', format: 'float' },
    intensidade: { type: 'number', format: 'float' },
  },
};

export async function fraquezasAmeacasShRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar registros com paginação e filtros
  fastify.get('/', {
    schema: {
      tags: ['fraquezas-ameacas-sh'],
      description: 'Listar registros de fraquezas e ameaças SH',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string', description: 'Número da página' },
          limit: { type: 'string', description: 'Itens por página' },
          numeroTraco: { type: 'string', description: 'Filtrar por número do traço' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            registros: { type: 'array', items: registroSchema },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
  }, fraquezasAmeacasShController.listFraquezasAmeacasSh.bind(fraquezasAmeacasShController));

  // Obter registro por ID
  fastify.get('/:id', {
    schema: {
      tags: ['fraquezas-ameacas-sh'],
      description: 'Obter registro por ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      response: {
        200: {
          type: 'object',
          properties: { registro: registroSchema },
        },
        404: {
          type: 'object',
          properties: { error: { type: 'string' }, code: { type: 'string' } },
        },
      },
    },
  }, fraquezasAmeacasShController.getFraquezasAmeacasSh.bind(fraquezasAmeacasShController));

  // Atualizar registro por ID
  fastify.put('/:id', {
    schema: {
      tags: ['fraquezas-ameacas-sh'],
      description: 'Atualizar registro de fraquezas e ameaças SH',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      body: {
        type: 'object',
        properties: {
          numeroTraco: { type: 'number' },
          pergunta: { type: 'string' },
          explicacao: { type: 'string' },
          swot: { type: 'string' },
          frequencia: { type: 'number' },
          intensidade: { type: 'number' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: { registro: registroSchema },
        },
        404: {
          type: 'object',
          properties: { error: { type: 'string' }, code: { type: 'string' } },
        },
      },
    },
  }, fraquezasAmeacasShController.updateFraquezasAmeacasSh.bind(fraquezasAmeacasShController));

  // Deletar registro por ID
  fastify.delete('/:id', {
    schema: {
      tags: ['fraquezas-ameacas-sh'],
      description: 'Deletar registro de fraquezas e ameaças SH',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      response: {
        200: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
        404: {
          type: 'object',
          properties: { error: { type: 'string' }, code: { type: 'string' } },
        },
      },
    },
  }, fraquezasAmeacasShController.deleteFraquezasAmeacasSh.bind(fraquezasAmeacasShController));
}

