import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
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

  // Erro do Prisma
  if (error.name === 'PrismaClientKnownRequestError') {
    return reply.status(400).send({
      error: 'Erro ao processar requisição no banco de dados',
      code: 'DATABASE_ERROR',
    });
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

