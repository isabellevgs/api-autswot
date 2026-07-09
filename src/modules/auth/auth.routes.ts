import type { FastifyInstance } from 'fastify';
import { authRateLimit } from '../../plugins/rate-limit.js';
import { AuthController } from './auth.controller.js';

const authController = new AuthController();

export async function authRoutes(fastify: FastifyInstance) {
  // Rotas públicas
  fastify.post('/register', {
    ...authRateLimit,
    schema: {
      tags: ['auth'],
      description: 'Registrar novo usuário',
      body: {
        type: 'object',
        required: [
          'email',
          'name',
          'password',
          'especialistaIndicacao',
          'diagnosticadoTea',
          'outrasCondicoesSaude',
          'outrasCondicoesDetalhe',
          'acessoMedicacoes',
          'terapiasNaoMedicamentosas',
          'idade',
          'corRaca',
          'genero',
          'generoOutroTexto',
          'profissao',
          'escolaridade',
          'comQuemMora',
          'situacaoTrabalho',
          'auxilioGovernoExperiencia',
          'nivelRenda',
          'burnout',
          'burnoutDescricao',
          'pensamentosSuicidio',
          'frequenciaSuicidio12meses',
          'contouSuicidioOuBarreiras',
          'probabilidadeSuicidioFuturoExplicacao',
        ],
        additionalProperties: false,
        properties: {
          email: { type: 'string', format: 'email', description: 'Email do usuário' },
          name: { type: 'string', minLength: 3, maxLength: 100, description: 'Nome do usuário' },
          password: { type: 'string', minLength: 8, maxLength: 100, description: 'Senha (mínimo 8 caracteres)' },
          especialistaIndicacao: { type: 'string', maxLength: 300 },
          diagnosticadoTea: { type: 'string', enum: ['sim', 'nao'] },
          outrasCondicoesSaude: { type: 'string', enum: ['sim', 'nao'] },
          outrasCondicoesDetalhe: { type: 'string', maxLength: 2000 },
          acessoMedicacoes: {
            type: 'string',
            enum: ['sim', 'nao_nao_quero', 'nao_sem_recursos'],
          },
          terapiasNaoMedicamentosas: {
            type: 'string',
            enum: ['sim_todas_recomendadas', 'sim_parcialmente_tempo', 'sim_parcialmente_dinheiro', 'nao_nao_quero', 'nao_sem_dinheiro'],
          },
          idade: { type: 'string', maxLength: 30 },
          corRaca: { type: 'string', enum: ['preto', 'pardo', 'branca', 'amarela'] },
          genero: { type: 'string', enum: ['masculino', 'feminino', 'outro', 'prefiro_nao_dizer'] },
          generoOutroTexto: { type: 'string', maxLength: 200 },
          profissao: { type: 'string', maxLength: 300 },
          escolaridade: {
            type: 'string',
            enum: ['ensino_basico_1_4', 'ensino_fundamental_5_9', 'ensino_medio', 'graduacao_curso_ou_completa', 'pos_graduacao_curso_ou_completa'],
          },
          comQuemMora: { type: 'string', enum: ['sozinho', 'pais_parentes', 'amigos_colegas', 'parceiro_romantico'] },
          situacaoTrabalho: { type: 'string', enum: ['clt', 'autonomo_empreendedor', 'nao'] },
          auxilioGovernoExperiencia: { type: 'string', maxLength: 4000 },
          nivelRenda: {
            type: 'string',
            enum: ['sem_renda', 'bolsa_familia_bpc', 'ate_1_sm', 'ate_2_sm', 'ate_3_sm', 'mais_3_sm'],
          },
          burnout: { type: 'string', enum: ['sim', 'nao'] },
          burnoutDescricao: { type: 'string', maxLength: 4000 },
          pensamentosSuicidio: {
            type: 'string',
            enum: ['nunca', 'pensamento_breve', 'plano_sem_tentativa', 'plano_pensou_executar', 'tentativa_parar_dor', 'tentativa_queria_morrer'],
          },
          frequenciaSuicidio12meses: {
            type: 'string',
            enum: ['nunca', 'raramente', 'as_vezes', 'frequentemente', 'muito_frequentemente'],
          },
          contouSuicidioOuBarreiras: { type: 'string', maxLength: 4000 },
          probabilidadeSuicidioFuturoExplicacao: { type: 'string', maxLength: 4000 },
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
    ...authRateLimit,
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
    ...authRateLimit,
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
            refreshToken: { type: 'string' },
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
                  profileRegistration: { type: 'object', additionalProperties: true, nullable: true },
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
              accessToken: { type: 'string' },
              refreshToken: { type: 'string' },
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
            newPassword: { type: 'string', minLength: 8 },
          },
        },
        response: {
          200: {
            description: 'Senha alterada',
            type: 'object',
            properties: {
              message: { type: 'string' },
              accessToken: { type: 'string' },
              refreshToken: { type: 'string' },
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

