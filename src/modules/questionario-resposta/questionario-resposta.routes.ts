import type { FastifyInstance } from 'fastify';
import { QuestionarioRespostaController } from './questionario-resposta.controller.js';

const controller = new QuestionarioRespostaController();

export async function questionarioRespostaRoutes(fastify: FastifyInstance) {
  // Todas as rotas requerem autenticação
  fastify.addHook('onRequest', fastify.authenticate);

  // Listar respostas do usuário
  fastify.get('/', {
    schema: {
      tags: ['questionario-resposta'],
      description: 'Listar respostas do questionário do usuário',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          tipo: { 
            type: 'string', 
            enum: ['SH', 'CH', 'FO', 'F'],
            description: 'Filtrar por tipo de pergunta' 
          },
        },
      },
      response: {
        200: {
          description: 'Lista de respostas',
          type: 'object',
          properties: {
            respostas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  perguntaId: { type: 'string' },
                  tipo: { type: 'string' },
                  numeroTraco: { type: 'number' },
                  resposta: { type: 'string', nullable: true },
                  frequencia: { type: 'number', nullable: true },
                  intensidade: { type: 'number', nullable: true },
                  mediaUser: { type: 'number', nullable: true, description: 'Média calculada para SH e CH: (frequencia + intensidade * 5/3) / 2' },
                  classificacaoAmeacaFraqueza: { type: 'string', nullable: true, enum: ['ameaça', 'fraqueza'], description: 'Classificação: ameaça se mediaUser >= intensidade da tabela, fraqueza caso contrário' },
                  classificacaoTraco: { type: 'string', nullable: true, enum: ['neutro', 'oportunidade', 'fraqueza', 'forca'], description: 'Classificação do traço para FO e F baseada na frequência' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }, controller.listRespostas.bind(controller));

  // Obter resposta específica
  fastify.get('/:id', {
    schema: {
      tags: ['questionario-resposta'],
      description: 'Obter resposta por ID',
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
          description: 'Dados da resposta',
          type: 'object',
          properties: {
            resposta: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                perguntaId: { type: 'string' },
                tipo: { type: 'string' },
                numeroTraco: { type: 'number' },
                resposta: { type: 'string', nullable: true },
                frequencia: { type: 'number', nullable: true },
                intensidade: { type: 'number', nullable: true },
                mediaUser: { type: 'number', nullable: true, description: 'Média calculada para SH e CH: (frequencia + intensidade * 5/3) / 2' },
                classificacaoAmeacaFraqueza: { type: 'string', nullable: true, enum: ['ameaça', 'fraqueza'], description: 'Classificação: ameaça se mediaUser >= intensidade da tabela, fraqueza caso contrário' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
        404: {
          description: 'Resposta não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, controller.getResposta.bind(controller));

  // Salvar uma resposta
  fastify.post('/', {
    schema: {
      tags: ['questionario-resposta'],
      description: 'Salvar ou atualizar uma resposta do questionário',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['perguntaId', 'tipo', 'numeroTraco'],
        properties: {
          perguntaId: { type: 'string', format: 'uuid' },
          tipo: { type: 'string', enum: ['SH', 'CH', 'FO', 'F'] },
          numeroTraco: { type: 'number' },
          resposta: { type: 'string', nullable: true },
          frequencia: { type: 'number', nullable: true },
          intensidade: { type: 'number', nullable: true },
        },
      },
      response: {
        201: {
          description: 'Resposta salva com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            resposta: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                perguntaId: { type: 'string' },
                tipo: { type: 'string' },
                numeroTraco: { type: 'number' },
                resposta: { type: 'string', nullable: true },
                frequencia: { type: 'number', nullable: true },
                intensidade: { type: 'number', nullable: true },
                mediaUser: { type: 'number', nullable: true, description: 'Média calculada para SH e CH: (frequencia + intensidade * 5/3) / 2' },
                classificacaoAmeacaFraqueza: { type: 'string', nullable: true, enum: ['ameaça', 'fraqueza'], description: 'Classificação: ameaça se mediaUser >= intensidade da tabela, fraqueza caso contrário' },
                classificacaoTraco: { type: 'string', nullable: true, enum: ['neutro', 'oportunidade', 'fraqueza', 'forca'], description: 'Classificação do traço para FO e F baseada na frequência' },
              },
            },
          },
        },
      },
    },
  }, controller.salvarResposta.bind(controller));

  // Salvar múltiplas respostas
  fastify.post('/batch', {
    schema: {
      tags: ['questionario-resposta'],
      description: 'Salvar múltiplas respostas do questionário',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['respostas'],
        properties: {
          respostas: {
            type: 'array',
            items: {
              type: 'object',
              required: ['perguntaId', 'tipo', 'numeroTraco'],
              properties: {
                perguntaId: { type: 'string', format: 'uuid' },
                tipo: { type: 'string', enum: ['SH', 'CH', 'FO', 'F'] },
                numeroTraco: { type: 'number' },
                resposta: { type: 'string', nullable: true },
                frequencia: { type: 'number', nullable: true },
                intensidade: { type: 'number', nullable: true },
              },
            },
          },
        },
      },
      response: {
        201: {
          description: 'Respostas salvas com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            count: { type: 'number' },
          },
        },
      },
    },
  }, controller.salvarRespostas.bind(controller));

  // Deletar resposta
  fastify.delete('/:id', {
    schema: {
      tags: ['questionario-resposta'],
      description: 'Deletar resposta',
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
          description: 'Resposta deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        404: {
          description: 'Resposta não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, controller.deletarResposta.bind(controller));

  // Obter SWOT completo organizado por módulos
  fastify.get('/swot', {
    schema: {
      tags: ['questionario-resposta'],
      description: 'Obter SWOT completo organizado por módulos (Forças, Fraquezas, Oportunidades, Ameaças)',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'SWOT completo',
          type: 'object',
          properties: {
            forcas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  perguntaId: { type: 'string' },
                  tipo: { type: 'string' },
                  numeroTraco: { type: 'number' },
                  resposta: { type: 'string', nullable: true },
                  frequencia: { type: 'number', nullable: true },
                  intensidade: { type: 'number', nullable: true },
                  mediaUser: { type: 'number', nullable: true },
                  classificacaoAmeacaFraqueza: { type: 'string', nullable: true },
                  classificacaoTraco: { type: 'string', nullable: true },
                  swot: { type: 'string', nullable: true },
                },
              },
            },
            fraquezas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  perguntaId: { type: 'string' },
                  tipo: { type: 'string' },
                  numeroTraco: { type: 'number' },
                  resposta: { type: 'string', nullable: true },
                  frequencia: { type: 'number', nullable: true },
                  intensidade: { type: 'number', nullable: true },
                  mediaUser: { type: 'number', nullable: true },
                  classificacaoAmeacaFraqueza: { type: 'string', nullable: true },
                  classificacaoTraco: { type: 'string', nullable: true },
                  swot: { type: 'string', nullable: true },
                },
              },
            },
            oportunidades: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  perguntaId: { type: 'string' },
                  tipo: { type: 'string' },
                  numeroTraco: { type: 'number' },
                  resposta: { type: 'string', nullable: true },
                  frequencia: { type: 'number', nullable: true },
                  intensidade: { type: 'number', nullable: true },
                  mediaUser: { type: 'number', nullable: true },
                  classificacaoAmeacaFraqueza: { type: 'string', nullable: true },
                  classificacaoTraco: { type: 'string', nullable: true },
                  swot: { type: 'string', nullable: true },
                },
              },
            },
            ameacas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  perguntaId: { type: 'string' },
                  tipo: { type: 'string' },
                  numeroTraco: { type: 'number' },
                  resposta: { type: 'string', nullable: true },
                  frequencia: { type: 'number', nullable: true },
                  intensidade: { type: 'number', nullable: true },
                  mediaUser: { type: 'number', nullable: true },
                  classificacaoAmeacaFraqueza: { type: 'string', nullable: true },
                  classificacaoTraco: { type: 'string', nullable: true },
                  swot: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
      },
    },
  }, controller.obterSwotCompleto.bind(controller));
}

