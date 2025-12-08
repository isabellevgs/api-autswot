import type { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";

export async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    max: 100,
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
      max: 5,
      timeWindow: "5 minutes",
    },
  },
};
