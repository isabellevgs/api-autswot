import Fastify from "fastify";
import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import { env } from "./config/env.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { userRoutes } from "./modules/user/user.routes.js";
import { postRoutes } from "./modules/post/post.routes.js";
import { diarioRoutes } from "./modules/diario/diario.routes.js";
import { fraquezasAmeacasShRoutes } from "./modules/fraquezas-ameacas-sh/fraquezas-ameacas-sh.routes.js";
import { fraquezasAmeacasChRoutes } from "./modules/fraquezas-ameacas-ch/fraquezas-ameacas-ch.routes.js";
import { fraquezasOportunidadesRoutes } from "./modules/fraquezas-oportunidades/fraquezas-oportunidades.routes.js";
import { historiasSociaisRoutes } from "./modules/historias-sociais/historias-sociais.routes.js";
import { forcasRoutes } from "./modules/forcas/forcas.routes.js";
import { questionarioRespostaRoutes } from "./modules/questionario-resposta/questionario-resposta.routes.js";
import { tracoDetalheRoutes } from "./modules/traco-detalhe/traco-detalhe.routes.js";
import { relatorioShRoutes } from "./modules/relatorio-sh/relatorio-sh.routes.js";
import { relatorioChRoutes } from "./modules/relatorio-ch/relatorio-ch.routes.js";
import { reflexaoTracoRoutes } from "./modules/reflexao-traco/reflexao-traco.routes.js";
import { prisma } from "./config/database.js";
import { errorHandler } from "./plugins/error-handler.js";
import { rateLimitPlugin } from "./plugins/rate-limit.js";
import { swaggerPlugin } from "./plugins/swagger.js";
import { UnauthorizedError, ForbiddenError } from "./utils/errors.js";
import { normalizeRole } from "./modules/auth/auth.tokens.js";

// Tipos para JWT
interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: "USER" | "SUPER_USER";
  sv?: number;
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    requireRole: (
      roles: "SUPER_USER"[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    jwt: {
      sign: (payload: object, options?: { expiresIn?: string }) => string;
      verify: <T extends object>(token: string) => T;
      refresh: {
        sign: (payload: object, options?: { expiresIn?: string }) => string;
        verify: <T extends object>(token: string) => T;
      };
    };
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: JwtPayload;
  }
}

const ALLOWED_ORIGINS: string[] = env.FRONTEND_URL
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

if (env.NODE_ENV !== "test") {
  console.log(`[CORS] NODE_ENV: ${env.NODE_ENV}`);
  console.log(`[CORS] Origens permitidas: ${ALLOWED_ORIGINS.join(", ")}`);
}

/** Registra rotas com e sem prefixo /v1 (compatibilidade com clientes existentes). */
async function registerDualRoutes(
  fastify: Awaited<ReturnType<typeof Fastify>>,
  routes: Parameters<typeof fastify.register>[0],
  basePath: string,
) {
  await fastify.register(routes, { prefix: `/v1${basePath}` });
  await fastify.register(routes, { prefix: basePath });
}


export async function buildServer() {
  const fastify = Fastify({
    trustProxy: true,
    logger:
      env.NODE_ENV === "production"
        ? {
            level: "error", // Só mostra erros em produção
            redact: ["req.headers.authorization"], // Remove dados sensíveis
          }
        : {
            level: "info",
            transport: {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            },
          },
  });

  // ── CORS manual via hook ────────────────────────────────────────────────
  // Substituímos @fastify/cors por hook raw para garantir compatibilidade
  // total com Fastify v5 e evitar problemas de interceptação do proxy.
  fastify.addHook('onRequest', async (request, reply) => {
    const origin = request.headers['origin'] as string | undefined;
    const isDev  = env.NODE_ENV !== 'production';
    const allowed = isDev || !origin || ALLOWED_ORIGINS.includes(origin);

    if (env.NODE_ENV === 'development') {
      console.log(`[CORS] ${request.method} ${request.url} origin="${origin ?? 'none'}" allowed=${allowed}`);
    }

    if (origin && allowed) {
      reply.header('Access-Control-Allow-Origin',      origin);
      reply.header('Access-Control-Allow-Credentials', 'true');
      reply.header('Vary', 'Origin');
    }

    // Preflight OPTIONS — responde imediatamente com 204
    if (request.method === 'OPTIONS') {
      return reply
        .header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        .header('Access-Control-Max-Age', '86400')
        .code(204)
        .send();
    }
  });

  // Garantir CORS nos erros também (error handler pode sobrescrever headers)
  fastify.addHook('onSend', async (request, reply) => {
    const origin = request.headers['origin'] as string | undefined;
    const isDev  = env.NODE_ENV !== 'production';
    if (origin && (isDev || ALLOWED_ORIGINS.includes(origin))) {
      reply.header('Access-Control-Allow-Origin',      origin);
      reply.header('Access-Control-Allow-Credentials', 'true');
    }
  });

  // Registrar plugins de segurança
  await fastify.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === "production",
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hidePoweredBy: true,
  });

  // Registrar Rate Limit
  await rateLimitPlugin(fastify);

  // Registrar Swagger (documentação)
  await swaggerPlugin(fastify);

  // Access token JWT
  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Refresh token JWT (secret separado)
  await fastify.register(jwt, {
    secret: env.JWT_REFRESH_SECRET,
    namespace: 'refresh',
  });

  // Decorator para verificar autenticação
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, _reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch {
        throw new UnauthorizedError("Token inválido ou ausente");
      }

      const payload = request.user as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, email: true, name: true, role: true, sessionVersion: true },
      });

      if (!user) {
        throw new UnauthorizedError("Usuário não encontrado");
      }

      const tokenSv = payload.sv ?? 0;
      if (user.sessionVersion !== tokenSv) {
        throw new UnauthorizedError("Sessão expirada. Faça login novamente.");
      }

      request.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: normalizeRole(user.role) as JwtPayload["role"],
        sv: user.sessionVersion,
      };
    }
  );

  // Decorator para verificar role do usuário
  fastify.decorate("requireRole", function (roles: "SUPER_USER"[]) {
    const app = this;
    return async function (request: FastifyRequest, reply: FastifyReply) {
      await app.authenticate(request, reply);

      const userRole = normalizeRole(request.user.role);

      if (!roles.includes(userRole as "SUPER_USER")) {
        throw new ForbiddenError("Acesso negado. Permissão insuficiente.");
      }
    };
  });

  // Registrar error handler
  fastify.setErrorHandler(errorHandler);

  // Rota raiz minimalista
  fastify.get("/", async () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  });

  // Health check com verificação do banco
  fastify.get("/health", async (_request, reply) => {
    const base = {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: "healthy", database: "ok", ...base };
    } catch {
      return reply.status(503).send({
        status: "unhealthy",
        database: "error",
        ...base,
      });
    }
  });

  await registerDualRoutes(fastify, authRoutes, "/auth");
  await registerDualRoutes(fastify, userRoutes, "/users");
  await registerDualRoutes(fastify, postRoutes, "/posts");
  await registerDualRoutes(fastify, diarioRoutes, "/diario");
  await registerDualRoutes(fastify, fraquezasAmeacasShRoutes, "/fraquezas-ameacas-sh");
  await registerDualRoutes(fastify, fraquezasAmeacasChRoutes, "/fraquezas-ameacas-ch");
  await registerDualRoutes(fastify, fraquezasOportunidadesRoutes, "/fraquezas-oportunidades");
  await registerDualRoutes(fastify, historiasSociaisRoutes, "/historias-sociais");
  await registerDualRoutes(fastify, forcasRoutes, "/forcas");
  await registerDualRoutes(fastify, questionarioRespostaRoutes, "/questionario-resposta");
  await registerDualRoutes(fastify, tracoDetalheRoutes, "/traco-detalhe");
  await registerDualRoutes(fastify, relatorioShRoutes, "/relatorio-sh");
  await registerDualRoutes(fastify, relatorioChRoutes, "/relatorio-ch");
  await registerDualRoutes(fastify, reflexaoTracoRoutes, "/reflexao-traco");

  return fastify;
}
