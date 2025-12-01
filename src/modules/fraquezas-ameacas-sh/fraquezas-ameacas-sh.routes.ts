import type { FastifyInstance } from 'fastify';
import { FraquezasAmeacasShController } from './fraquezas-ameacas-sh.controller.js';

const fraquezasAmeacasShController = new FraquezasAmeacasShController();

export async function fraquezasAmeacasShRoutes(fastify: FastifyInstance) {
  // Todas as rotas de fraquezas-ameacas-sh requerem autenticação
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
                  pergunta: { type: 'string' },
                  explicacao: { type: 'string' },
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
                pergunta: { type: 'string' },
                explicacao: { type: 'string' },
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
  }, fraquezasAmeacasShController.getFraquezasAmeacasSh.bind(fraquezasAmeacasShController));
}

