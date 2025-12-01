import type { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller.js';

const authController = new AuthController();

export async function authRoutes(fastify: FastifyInstance) {
  // Rotas públicas
  fastify.post('/register', {
    schema: {
      tags: ['auth'],
      description: 'Registrar novo usuário',
      body: {
        type: 'object',
        required: ['email', 'name', 'password'],
        properties: {
          email: { type: 'string', format: 'email', description: 'Email do usuário' },
          name: { type: 'string', minLength: 3, description: 'Nome do usuário' },
          password: { type: 'string', minLength: 6, description: 'Senha (mínimo 6 caracteres)' },
        },
      },
      response: {
        201: {
          description: 'Usuário criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                createdAt: { type: 'string' },
              },
            },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        400: {
          description: 'Dados inválidos',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
        409: {
          description: 'Email já está em uso',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, authController.register.bind(authController));

  fastify.post('/login', {
    schema: {
      tags: ['auth'],
      description: 'Fazer login',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      response: {
        200: {
          description: 'Login realizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string', enum: ['USER', 'SUPER_USER'] },
                createdAt: { type: 'string' },
              },
            },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        401: {
          description: 'Credenciais inválidas',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, authController.login.bind(authController));

  fastify.post('/refresh-token', {
    schema: {
      tags: ['auth'],
      description: 'Renovar access token',
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', description: 'Refresh token válido' },
        },
      },
      response: {
        200: {
          description: 'Token renovado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            accessToken: { type: 'string' },
          },
        },
        401: {
          description: 'Refresh token inválido',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, authController.refreshToken.bind(authController));

  // Rotas protegidas
  fastify.register(async (authenticatedRoutes) => {
    authenticatedRoutes.addHook('onRequest', fastify.authenticate);

    authenticatedRoutes.get('/me', {
      schema: {
        tags: ['auth'],
        description: 'Obter dados do usuário atual',
        security: [{ bearerAuth: [] }],
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
                  role: { type: 'string', enum: ['USER', 'SUPER_USER'] },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
          401: {
            description: 'Não autorizado',
            type: 'object',
            properties: {
              error: { type: 'string' },
              code: { type: 'string' },
            },
          },
        },
      },
    }, authController.getProfile.bind(authController));

    authenticatedRoutes.put('/profile', {
      schema: {
        tags: ['auth'],
        description: 'Atualizar perfil do usuário',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3 },
            email: { type: 'string', format: 'email' },
          },
        },
        response: {
          200: {
            description: 'Perfil atualizado',
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
    }, authController.updateProfile.bind(authController));

    authenticatedRoutes.put('/change-password', {
      schema: {
        tags: ['auth'],
        description: 'Trocar senha',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string' },
            newPassword: { type: 'string', minLength: 6 },
          },
        },
        response: {
          200: {
            description: 'Senha alterada',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    }, authController.changePassword.bind(authController));

    authenticatedRoutes.delete('/account', {
      schema: {
        tags: ['auth'],
        description: 'Excluir conta',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Conta excluída',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    }, authController.deleteAccount.bind(authController));
  });
}

