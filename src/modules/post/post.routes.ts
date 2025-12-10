import type { FastifyInstance } from 'fastify';
import { PostController } from './post.controller.js';

const postController = new PostController();

export async function postRoutes(fastify: FastifyInstance) {
  // Rotas públicas (leitura)
  fastify.get('/', {
    schema: {
      tags: ['posts'],
      description: 'Listar posts com paginação e busca',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string', description: 'Número da página' },
          limit: { type: 'string', description: 'Itens por página' },
          search: { type: 'string', description: 'Buscar por título ou conteúdo' },
        },
      },
      response: {
        200: {
          description: 'Lista de posts',
          type: 'object',
          properties: {
            posts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  content: { type: 'string' },
                  imageUrl: { type: 'string', nullable: true },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                  author: {
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
  }, postController.listPosts.bind(postController));

  fastify.get('/:id', {
    schema: {
      tags: ['posts'],
      description: 'Obter post por ID',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      response: {
        200: {
          description: 'Dados do post',
          type: 'object',
          properties: {
            post: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                content: { type: 'string' },
                imageUrl: { type: 'string', nullable: true },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                author: {
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
          description: 'Post não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
  }, postController.getPost.bind(postController));

  // Rotas protegidas (criação, edição, exclusão)
  // Apenas usuários autenticados com role SUPER_USER podem criar/editar/deletar
  fastify.register(async (authenticatedRoutes) => {
    authenticatedRoutes.addHook('onRequest', async (request, reply) => {
      await fastify.authenticate(request, reply);
      const user = request.user as any;
      if (user.role !== 'SUPER_USER') {
        return reply.status(403).send({
          error: 'Acesso negado. Apenas super usuários podem gerenciar posts.',
          code: 'FORBIDDEN',
        });
      }
    });

    authenticatedRoutes.post('/', {
    schema: {
      tags: ['posts'],
      description: 'Criar novo post',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 200, description: 'Título do post' },
          content: { type: 'string', minLength: 1, description: 'Conteúdo HTML do post' },
          imageUrl: { type: 'string', format: 'uri', description: 'URL da imagem de capa (opcional)' },
        },
      },
      response: {
        201: {
          description: 'Post criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            post: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                content: { type: 'string' },
                imageUrl: { type: 'string', nullable: true },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                author: {
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
        400: {
          description: 'Dados inválidos',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
    }, postController.createPost.bind(postController));

    authenticatedRoutes.put('/:id', {
    schema: {
      tags: ['posts'],
      description: 'Atualizar post',
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
          title: { type: 'string', minLength: 1, maxLength: 200 },
          content: { type: 'string', minLength: 1 },
          imageUrl: { type: 'string', format: 'uri' },
        },
      },
      response: {
        200: {
          description: 'Post atualizado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            post: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                content: { type: 'string' },
                imageUrl: { type: 'string', nullable: true },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
        404: {
          description: 'Post não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
    }, postController.updatePost.bind(postController));

    authenticatedRoutes.delete('/:id', {
    schema: {
      tags: ['posts'],
      description: 'Excluir post',
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
          description: 'Post excluído',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        404: {
          description: 'Post não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
    }, postController.deletePost.bind(postController));
  });
}

