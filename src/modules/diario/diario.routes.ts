import type { FastifyInstance } from 'fastify';
import * as controller from './diario.controller.js';

export async function diarioRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/jornada/paginas', {
    handler: controller.listarPaginasJornada,
  });

  fastify.get('/jornada/paginas/:chave', {
    handler: controller.obterPaginaJornada,
  });

  fastify.put('/jornada/paginas/:chave', {
    handler: controller.salvarPaginaJornada,
  });

  fastify.get('/autoadvocacia/quinzenas', {
    handler: controller.listarQuinzenas,
  });

  fastify.post('/autoadvocacia/quinzenas', {
    handler: controller.criarQuinzena,
  });

  fastify.put('/autoadvocacia/quinzenas/:numero', {
    handler: controller.salvarQuinzena,
  });

  fastify.get('/jornada/user/:userId', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    handler: controller.listarJornadaAdmin,
  });

  fastify.get('/autoadvocacia/user/:userId', {
    onRequest: [fastify.requireRole(['SUPER_USER'])],
    handler: controller.listarAutoadvocaciaAdmin,
  });
}
