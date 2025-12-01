import type { FastifyInstance } from 'fastify';
import { FraquezasAmeacasChController } from './fraquezas-ameacas-ch.controller.js';

const fraquezasAmeacasChController = new FraquezasAmeacasChController();

export async function fraquezasAmeacasChRoutes(fastify: FastifyInstance) {
  // Todas as rotas de fraquezas-ameacas-ch requerem autenticação
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar registros com paginação e filtros
  fastify.get('/', {
    schema: {
      tags: ['fraquezas-ameacas-ch'],
      description: 'Listar registros de fraquezas e ameaças CH',
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
          description: 'Lista de registros',
          type: 'object',
          properties: {
            registros: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  numeroTraco: { type: 'number' },
                  numHistoria: { type: 'number' },
                  frequencia: { type: 'number', format: 'float' },
                  intensidade: { type: 'number', format: 'float' },
                },
              },
            },
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
  }, fraquezasAmeacasChController.listFraquezasAmeacasCh.bind(fraquezasAmeacasChController));

  // Obter registro por ID
  fastify.get('/:id', {
    schema: {
      tags: ['fraquezas-ameacas-ch'],
      description: 'Obter registro por ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      response: {
        200: {
          description: 'Dados do registro',
          type: 'object',
          properties: {
            registro: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                numeroTraco: { type: 'number' },
                numHistoria: { type: 'number' },
                frequencia: { type: 'number' },
                intensidade: { type: 'number' },
              },
            },
          },
        },
        404: {
          description: 'Registro não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, fraquezasAmeacasChController.getFraquezasAmeacasCh.bind(fraquezasAmeacasChController));
}

