import type { FastifyInstance } from 'fastify';
import { AppDataController } from './app-data.controller.js';

const appDataController = new AppDataController();

export async function appDataRoutes(fastify: FastifyInstance) {
  fastify.get('/tcle', {
    schema: {
      tags: ['app-data'],
      description: 'Obter o texto do Termo de Consentimento Livre e Esclarecido',
      response: {
        200: {
          type: 'object',
          properties: {
            tcle: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, appDataController.getTcle.bind(appDataController));

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', fastify.authenticate);

    protectedRoutes.put('/tcle', {
      onRequest: [fastify.requireRole(['SUPER_USER'])],
      schema: {
        tags: ['app-data'],
        description: 'Atualizar o texto do TCLE (admin)',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['tcle'],
          properties: {
            tcle: { type: 'string', minLength: 1 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              tcle: { type: 'string' },
            },
          },
        },
      },
    }, appDataController.updateTcle.bind(appDataController));
  });
}
