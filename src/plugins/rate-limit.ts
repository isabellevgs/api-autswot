import type { FastifyInstance, FastifyRequest } from "fastify";
import rateLimit from "@fastify/rate-limit";

const MONITORING_PATHS = new Set(["/", "/health"]);

function isMonitoringRoute(request: FastifyRequest): boolean {
  const path = request.url.split("?")[0];
  return MONITORING_PATHS.has(path);
}

export async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    max: 1000,
    timeWindow: "15 minutes",
    allowList: (request) => isMonitoringRoute(request),
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
