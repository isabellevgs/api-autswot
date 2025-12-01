import type { FastifyInstance } from 'fastify';
import { FraquezasOportunidadesController } from './fraquezas-oportunidades.controller.js';

const fraquezasOportunidadesController = new FraquezasOportunidadesController();

export async function fraquezasOportunidadesRoutes(fastify: FastifyInstance) {
  // Todas as rotas de fraquezas-oportunidades requerem autenticação
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar registros com paginação e filtros
  fastify.get('/', {
    schema: {
      tags: ['fraquezas-oportunidades'],
      description: 'Listar registros de fraquezas e oportunidades',
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
                  tracoNeutro: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        valor: { type: 'string' },
                      },
                    },
                  },
                  tracoOportunidade: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        valor: { type: 'string' },
                      },
                    },
                  },
                  tracoFraqueza: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        valor: { type: 'string' },
                      },
                    },
                  },
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
  }, fraquezasOportunidadesController.listFraquezasOportunidades.bind(fraquezasOportunidadesController));

  // Obter registro por ID
  fastify.get('/:id', {
    schema: {
      tags: ['fraquezas-oportunidades'],
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
                tracoNeutro: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      valor: { type: 'string' },
                    },
                  },
                },
                tracoOportunidade: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      valor: { type: 'string' },
                    },
                  },
                },
                tracoFraqueza: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      valor: { type: 'string' },
                    },
                  },
                },
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
  }, fraquezasOportunidadesController.getFraquezasOportunidades.bind(fraquezasOportunidadesController));
}

