import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '../../generated/prisma/index.js';
import { AppError } from '../utils/errors.js';

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log do erro
  request.log.error(error);

  // Erro de validação Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Dados inválidos',
      code: 'VALIDATION_ERROR',
      details: error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Erro customizado da aplicação
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      code: error.code,
      ...(error instanceof Error && error.name === 'ValidationError' && { details: (error as any).details }),
    });
  }

  // Erro do Prisma (códigos: https://www.prisma.io/docs/orm/reference/error-reference)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = (error.meta?.target as string[] | undefined)?.join(', ') ?? 'campo';
        return reply.status(409).send({
          error: 'Já existe um registro com estes dados (restrição única). Se for e-mail, use outro ou faça login.',
          code: 'UNIQUE_VIOLATION',
          field: target,
        });
      }
      case 'P2022':
        return reply.status(500).send({
          error:
            'O banco de dados está desatualizado em relação ao código (coluna inexistente). Na pasta da API, execute: npx prisma migrate deploy   ou, em desenvolvimento: npx prisma db push',
          code: 'DATABASE_SCHEMA_OUT_OF_SYNC',
        });
      case 'P2021':
        return reply.status(500).send({
          error:
            'Tabela não encontrada no banco. Execute as migrations: npx prisma migrate deploy (pasta da API).',
          code: 'DATABASE_TABLE_MISSING',
        });
      case 'P2003':
        return reply.status(400).send({
          error: 'Referência inválida no banco de dados (integridade).',
          code: 'FOREIGN_KEY_VIOLATION',
        });
      default:
        request.log.error({ prismaCode: error.code, meta: error.meta }, 'Prisma request error');
        return reply.status(400).send({
          error: 'Erro ao processar requisição no banco de dados',
          code: 'DATABASE_ERROR',
          prismaCode: error.code,
        });
    }
  }

  // Erro do JWT
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return reply.status(401).send({
      error: 'Token inválido ou expirado',
      code: 'INVALID_TOKEN',
    });
  }

  // Erro genérico
  return reply.status(error.statusCode || 500).send({
    error: error.message || 'Erro interno do servidor',
    code: 'INTERNAL_SERVER_ERROR',
  });
}

