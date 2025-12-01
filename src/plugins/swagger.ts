import type { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { env } from '../config/env.js';

export async function swaggerPlugin(fastify: FastifyInstance) {
  // Registrar Swagger
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'API AutSWOT',
        description: 'API REST para o sistema AutSWOT - Análise SWOT para pessoas autistas',
        version: '2.0.0',
        contact: {
          name: 'Isabelle Vargas',
          email: 'contato@autswot.com',
        },
        license: {
          name: 'MIT',
        },
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: 'Servidor de Desenvolvimento',
        },
        {
          url: 'https://api.autswot.com',
          description: 'Servidor de Produção',
        },
      ],
      tags: [
        {
          name: 'health',
          description: 'Endpoints de health check',
        },
        {
          name: 'auth',
          description: 'Endpoints de autenticação e autorização',
        },
        {
          name: 'users',
          description: 'Endpoints de gerenciamento de usuários',
        },
        {
          name: 'products',
          description: 'Endpoints de gerenciamento de produtos',
        },
        {
          name: 'posts',
          description: 'Endpoints de gerenciamento de posts da comunidade',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Token JWT no formato: Bearer <token>',
          },
        },
      },
    },
  });

  // Registrar Swagger UI
  await fastify.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        theme: 'monokai',
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}

