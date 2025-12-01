import type { FastifyInstance } from 'fastify';
import { DiaryController } from './diary.controller.js';

const diaryController = new DiaryController();

export async function diaryRoutes(fastify: FastifyInstance) {
  // Todas as rotas de diary requerem autenticação
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar entradas de um usuário
  fastify.get('/user/:userId', {
    schema: {
      tags: ['diary'],
      description: 'Listar entradas do diário de um usuário',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
      response: {
        200: {
          description: 'Lista de entradas do diário',
          type: 'object',
          properties: {
            entries: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  date: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                  answers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        questionId: { type: 'string' },
                        texto: { type: 'string' },
                        question: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            texto: { type: 'string' },
                            ordem: { type: 'number' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, diaryController.getDiaryEntriesByUser.bind(diaryController));

  // Obter entrada por ID
  fastify.get('/:id', {
    schema: {
      tags: ['diary'],
      description: 'Obter entrada do diário por ID',
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
          description: 'Dados da entrada',
          type: 'object',
          properties: {
            entry: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                date: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                answers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      questionId: { type: 'string' },
                      texto: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'Entrada não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, diaryController.getDiaryEntry.bind(diaryController));

  // Criar entrada do diário
  fastify.post('/', {
    schema: {
      tags: ['diary'],
      description: 'Criar nova entrada do diário',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['date'],
        properties: {
          date: { type: 'string', format: 'date-time' },
          answers: {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
        },
      },
      response: {
        201: {
          description: 'Entrada criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            entry: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                date: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, diaryController.createDiaryEntry.bind(diaryController));

  // Atualizar entrada do diário
  fastify.put('/:id', {
    schema: {
      tags: ['diary'],
      description: 'Atualizar entrada do diário',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        properties: {
          answers: {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
        },
      },
      response: {
        200: {
          description: 'Entrada atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            entry: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                date: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
        404: {
          description: 'Entrada não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, diaryController.updateDiaryEntry.bind(diaryController));

  // Deletar entrada do diário
  fastify.delete('/:id', {
    schema: {
      tags: ['diary'],
      description: 'Deletar entrada do diário',
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
          description: 'Entrada deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        404: {
          description: 'Entrada não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, diaryController.deleteDiaryEntry.bind(diaryController));
}

