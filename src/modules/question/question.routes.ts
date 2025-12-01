import type { FastifyInstance } from 'fastify';
import { QuestionController } from './question.controller.js';

const questionController = new QuestionController();

export async function questionRoutes(fastify: FastifyInstance) {
  // Todas as rotas de question requerem autenticação
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar perguntas de um usuário específico
  fastify.get('/user/:userId', {
    schema: {
      tags: ['questions'],
      description: 'Listar perguntas de um usuário',
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
          description: 'Lista de perguntas',
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  texto: { type: 'string' },
                  ordem: { type: 'number' },
                  ativo: { type: 'boolean' },
                  userId: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      email: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, questionController.getQuestionsByUser.bind(questionController));

  // Obter pergunta por ID
  fastify.get('/:id', {
    schema: {
      tags: ['questions'],
      description: 'Obter pergunta por ID',
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
          description: 'Dados da pergunta',
          type: 'object',
          properties: {
            question: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                texto: { type: 'string' },
                ordem: { type: 'number' },
                userId: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'Pergunta não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, questionController.getQuestion.bind(questionController));

  // Criar pergunta para o usuário autenticado
  fastify.post('/', {
    schema: {
      tags: ['questions'],
      description: 'Criar nova pergunta',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['texto'],
        properties: {
          texto: { type: 'string', minLength: 1 },
          ordem: { type: 'number', minimum: 1 },
        },
      },
      response: {
        201: {
          description: 'Pergunta criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            question: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                texto: { type: 'string' },
                ordem: { type: 'number' },
                userId: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, questionController.createQuestion.bind(questionController));

  // Criar pergunta para um usuário específico (admin)
  fastify.post('/user/:userId', {
    schema: {
      tags: ['questions'],
      description: 'Criar pergunta para um usuário específico',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        required: ['texto'],
        properties: {
          texto: { type: 'string', minLength: 1 },
          ordem: { type: 'number', minimum: 1 },
        },
      },
      response: {
        201: {
          description: 'Pergunta criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            question: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                texto: { type: 'string' },
                ordem: { type: 'number' },
                userId: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, questionController.createQuestionForUser.bind(questionController));

  // Atualizar pergunta
  fastify.put('/:id', {
    schema: {
      tags: ['questions'],
      description: 'Atualizar pergunta',
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
          texto: { type: 'string', minLength: 1 },
          ordem: { type: 'number', minimum: 1 },
        },
      },
      response: {
        200: {
          description: 'Pergunta atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            question: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                texto: { type: 'string' },
                ordem: { type: 'number' },
                userId: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
        404: {
          description: 'Pergunta não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, questionController.updateQuestion.bind(questionController));

  // Reordenar perguntas
  fastify.post('/reorder', {
    schema: {
      tags: ['questions'],
      description: 'Reordenar perguntas',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['questions'],
        properties: {
          questions: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'ordem'],
              properties: {
                id: { type: 'string', format: 'uuid' },
                ordem: { type: 'number', minimum: 1 },
              },
            },
          },
        },
      },
      response: {
        200: {
          description: 'Perguntas reordenadas com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  texto: { type: 'string' },
                  ordem: { type: 'number' },
                  userId: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }, questionController.reorderQuestions.bind(questionController));

  // Deletar pergunta
  fastify.delete('/:id', {
    schema: {
      tags: ['questions'],
      description: 'Deletar pergunta',
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
          description: 'Pergunta deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        404: {
          description: 'Pergunta não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, questionController.deleteQuestion.bind(questionController));
}

