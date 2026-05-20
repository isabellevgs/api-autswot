import type { FastifyInstance } from 'fastify';
import { HistoriasSociaisController } from './historias-sociais.controller.js';

const historiasSociaisController = new HistoriasSociaisController();

const registroSchema = {
  type: 'object',
  properties: {
    id:                  { type: 'string' },
    numeroHistoria:      { type: 'number' },
    introducao:          { type: 'string' },
    titulo:              { type: 'string' },
    personagem:          { type: 'string' },
    ambientacao:         { type: 'string' },
    historia:            { type: 'string' },
    questionamento:      { type: 'string' },
    perguntaIntensidade: { type: 'string' },
    intensidadeLeve:     { type: 'string' },
    intensidadeModerada: { type: 'string' },
    intensidadeAlta:     { type: 'string' },
  },
};

export async function historiasSociaisRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar
  fastify.get('/', {
    schema: {
      tags: ['historias-sociais'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page:          { type: 'string' },
          limit:         { type: 'string' },
          numeroHistoria:{ type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            registros:  { type: 'array', items: registroSchema },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' }, limit: { type: 'number' },
                total: { type: 'number' }, totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
  }, historiasSociaisController.listHistoriasSociais.bind(historiasSociaisController));

  // Obter por ID
  fastify.get('/:id', {
    schema: {
      tags: ['historias-sociais'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      response: {
        200:  { type: 'object', properties: { registro: registroSchema } },
        404:  { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, historiasSociaisController.getHistoriasSociais.bind(historiasSociaisController));

  // Atualizar
  fastify.put('/:id', {
    schema: {
      tags: ['historias-sociais'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      body: {
        type: 'object',
        properties: {
          numeroHistoria:      { type: 'number' },
          introducao:          { type: 'string' },
          titulo:              { type: 'string' },
          personagem:          { type: 'string' },
          ambientacao:         { type: 'string' },
          historia:            { type: 'string' },
          questionamento:      { type: 'string' },
          perguntaIntensidade: { type: 'string' },
          intensidadeLeve:     { type: 'string' },
          intensidadeModerada: { type: 'string' },
          intensidadeAlta:     { type: 'string' },
        },
      },
      response: {
        200: { type: 'object', properties: { registro: registroSchema } },
        404: { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, historiasSociaisController.updateHistoriasSociais.bind(historiasSociaisController));

  // Deletar
  fastify.delete('/:id', {
    schema: {
      tags: ['historias-sociais'],
      security: [{ bearerAuth: [] }],
      params: { type: 'object', required: ['id'], properties: { id: { type: 'string', format: 'uuid' } } },
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' }, code: { type: 'string' } } },
      },
    },
  }, historiasSociaisController.deleteHistoriasSociais.bind(historiasSociaisController));
}

