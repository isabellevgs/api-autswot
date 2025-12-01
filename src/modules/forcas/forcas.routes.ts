import type { FastifyInstance } from 'fastify';
import { ForcasController } from './forcas.controller.js';

const forcasController = new ForcasController();

export async function forcasRoutes(fastify: FastifyInstance) {
  // Todas as rotas de forcas requerem autenticação
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar registros com paginação e filtros
  fastify.get('/', {
    schema: {
      tags: ['forcas'],
      description: 'Listar registros de forças',
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
                  exemplo: { type: 'string' },
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
                  tracoForca: {
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
  }, forcasController.listForcas.bind(forcasController));

  // Obter registro por ID
  fastify.get('/:id', {
    schema: {
      tags: ['forcas'],
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
                exemplo: { type: 'string' },
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
                tracoForca: {
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
  }, forcasController.getForcas.bind(forcasController));
}

