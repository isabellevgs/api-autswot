import type { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';

export async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    global: false, // Não aplicar globalmente
    max: 100, // Máximo de requisições
    timeWindow: '15 minutes', // Janela de tempo
    errorResponseBuilder: (request, context) => {
      return {
        error: 'Muitas requisições. Tente novamente mais tarde.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: context.ttl,
      };
    }
  });
}

// Rate limit específico para autenticação (mais restritivo)
export const authRateLimit = {
  config: {
    rateLimit: {
      max: 5,
      timeWindow: '5 minutes'
    }
  }
};

