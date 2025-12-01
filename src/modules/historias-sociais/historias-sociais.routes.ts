import type { FastifyInstance } from 'fastify';
import { HistoriasSociaisController } from './historias-sociais.controller.js';

const historiasSociaisController = new HistoriasSociaisController();

export async function historiasSociaisRoutes(fastify: FastifyInstance) {
  // Todas as rotas de historias-sociais requerem autenticação
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar registros com paginação e filtros
  fastify.get('/', {
    schema: {
      tags: ['historias-sociais'],
      description: 'Listar registros de histórias sociais',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string', description: 'Número da página' },
          limit: { type: 'string', description: 'Itens por página' },
          numeroHistoria: { type: 'string', description: 'Filtrar por número da história' },
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
                  numeroHistoria: { type: 'number' },
                  introducao: { type: 'string' },
                  titulo: { type: 'string' },
                  personagem: { type: 'string' },
                  ambientacao: { type: 'string' },
                  historia: { type: 'string' },
                  questionamento: { type: 'string' },
                  perguntaIntensidade: { type: 'string' },
                  intensidadeLeve: { type: 'string' },
                  intensidadeModerada: { type: 'string' },
                  intensidadeAlta: { type: 'string' },
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
  }, historiasSociaisController.listHistoriasSociais.bind(historiasSociaisController));

  // Obter registro por ID
  fastify.get('/:id', {
    schema: {
      tags: ['historias-sociais'],
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
                numeroHistoria: { type: 'number' },
                introducao: { type: 'string' },
                titulo: { type: 'string' },
                personagem: { type: 'string' },
                ambientacao: { type: 'string' },
                historia: { type: 'string' },
                questionamento: { type: 'string' },
                perguntaIntensidade: { type: 'string' },
                intensidadeLeve: { type: 'string' },
                intensidadeModerada: { type: 'string' },
                intensidadeAlta: { type: 'string' },
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
  }, historiasSociaisController.getHistoriasSociais.bind(historiasSociaisController));
}

