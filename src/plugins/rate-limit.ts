import type { FastifyInstance, FastifyRequest } from "fastify";
import rateLimit from "@fastify/rate-limit";

const MONITORING_PATHS = new Set(["/", "/health"]);

function isMonitoringRoute(request: FastifyRequest): boolean {
  const path = request.url.split("?")[0];
  return MONITORING_PATHS.has(path);
}

/** IP real do cliente quando a API está atrás de nginx/Coolify. */
export function clientIp(request: FastifyRequest): string {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return request.ip;
}

function isRateLimitExempt(request: FastifyRequest): boolean {
  if (isMonitoringRoute(request)) return true;
  if (request.method === "OPTIONS") return true;
  return false;
}

export async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    max: 1000,
    timeWindow: "15 minutes",
    keyGenerator: clientIp,
    allowList: (request) => isRateLimitExempt(request),
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: "Rate limit exceeded, please try again later.",
    }),
  });
}

// Rate limit específico para autenticação (por IP real, independente do global)
export const authRateLimit = {
  config: {
    rateLimit: {
      max: 30,
      timeWindow: "5 minutes",
      keyGenerator: clientIp,
    },
  },
};
