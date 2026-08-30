import type { FastifyInstance } from 'fastify';
import { UserController } from './user.controller.js';

const userController = new UserController();

export async function userRoutes(fastify: FastifyInstance) {
  // Todas as rotas de usuário requerem autenticação
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
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
                  role: { type: 'string', enum: ['USER', 'SUPER_USER'] },
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

  // Admin: ficha de cadastro sociodemográfico (requer SUPER_USER)
  fastify.get('/:id/registration', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: {
      tags: ['users'],
      description: 'Obter ficha de cadastro sociodemográfico de um usuário (admin)',
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
          description: 'Ficha de cadastro',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
                profileRegistration: { type: 'object', additionalProperties: true, nullable: true },
                createdAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, userController.getUserRegistration.bind(userController));

  // Admin: buscar usuário por email (requer SUPER_USER)
  fastify.get('/by-email', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: {
      tags: ['users'],
      description: 'Buscar usuário por email (admin)',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
      response: {
        200: {
          description: 'Dados do usuário',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string', enum: ['USER', 'SUPER_USER'] },
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
  }, userController.getUserByEmail.bind(userController));

  // Admin: buscar múltiplos usuários por lista de emails (requer SUPER_USER)
  fastify.post('/by-emails', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    schema: {
      tags: ['users'],
      description: 'Buscar múltiplos usuários por email em lote (admin)',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['emails'],
        properties: {
          emails: {
            type: 'array',
            items: { type: 'string', format: 'email' },
            minItems: 1,
            maxItems: 200,
          },
        },
      },
      response: {
        200: {
          description: 'Mapa de email -> dados do usuário (emails não encontrados ficam ausentes)',
          type: 'object',
          properties: {
            usuarios: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  name: { type: 'string', nullable: true },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }, userController.getUsersByEmails.bind(userController));
  
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

