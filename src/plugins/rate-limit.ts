import type { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";

export async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    max: 1000, // Aumentado de 100 para 1000 requisições
    timeWindow: "15 minutes",
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: "Rate limit exceeded, please try again later.",
    }),
  });
}

// Rate limit específico para autenticação (mais restritivo)
export const authRateLimit = {
  config: {
    rateLimit: {
      max: 20, // Aumentado de 5 para 20 requisições
      timeWindow: "5 minutes",
    },
  },
};
