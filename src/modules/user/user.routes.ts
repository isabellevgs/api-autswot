import type { FastifyInstance } from 'fastify';
import { UserController } from './user.controller.js';

const userController = new UserController();

export async function userRoutes(fastify: FastifyInstance) {
  // Todas as rotas de usuário requerem autenticação
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', {
    schema: {
      tags: ['users'],
      description: 'Listar usuários com paginação',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string', description: 'Número da página' },
          limit: { type: 'string', description: 'Itens por página' },
        },
      },
      response: {
        200: {
          description: 'Lista de usuários',
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
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
  }, userController.listUsers.bind(userController));

  fastify.get('/:id', {
    schema: {
      tags: ['users'],
      description: 'Obter usuário por ID',
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
          description: 'Dados do usuário',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
        404: {
          description: 'Usuário não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, userController.getUser.bind(userController));

  fastify.put('/:id', {
    schema: {
      tags: ['users'],
      description: 'Atualizar usuário',
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
          name: { type: 'string', minLength: 3 },
          email: { type: 'string', format: 'email' },
        },
      },
      response: {
        200: {
          description: 'Usuário atualizado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, userController.updateUser.bind(userController));

  // Admin: excluir usuário e todos os dados relacionados (requer SUPER_USER)
  fastify.delete('/:id', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: {
      tags: ['users'],
      description: 'Excluir usuário e todos os dados relacionados (admin)',
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
          description: 'Usuário excluído',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  }, userController.deleteUser.bind(userController));

  // Admin: redefinir senha de um usuário (requer SUPER_USER)
  fastify.patch('/:id/password', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: {
      tags: ['users'],
      description: 'Redefinir senha de um usuário (admin)',
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
        required: ['password'],
        properties: {
          password: { type: 'string', minLength: 8 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  }, userController.resetPassword.bind(userController));
}

