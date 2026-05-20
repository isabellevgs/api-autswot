import Fastify from "fastify";
import type { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import { env } from "./config/env.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { userRoutes } from "./modules/user/user.routes.js";
import { productRoutes } from "./modules/product/product.routes.js";
import { postRoutes } from "./modules/post/post.routes.js";
import { questionRoutes } from "./modules/question/question.routes.js";
import { diaryRoutes } from "./modules/diary/diary.routes.js";
import { fraquezasAmeacasShRoutes } from "./modules/fraquezas-ameacas-sh/fraquezas-ameacas-sh.routes.js";
import { fraquezasAmeacasChRoutes } from "./modules/fraquezas-ameacas-ch/fraquezas-ameacas-ch.routes.js";
import { fraquezasOportunidadesRoutes } from "./modules/fraquezas-oportunidades/fraquezas-oportunidades.routes.js";
import { historiasSociaisRoutes } from "./modules/historias-sociais/historias-sociais.routes.js";
import { forcasRoutes } from "./modules/forcas/forcas.routes.js";
import { questionarioRespostaRoutes } from "./modules/questionario-resposta/questionario-resposta.routes.js";
import { tracoDetalheRoutes } from "./modules/traco-detalhe/traco-detalhe.routes.js";
import { reflexaoTracoRoutes } from "./modules/reflexao-traco/reflexao-traco.routes.js";
import { errorHandler } from "./plugins/error-handler.js";
import { rateLimitPlugin } from "./plugins/rate-limit.js";
import { swaggerPlugin } from "./plugins/swagger.js";

// Tipos para JWT
interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: "USER" | "SUPER_USER";
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
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: JwtPayload;
  }
}

const getAllowedOrigins = () => {
  if (env.NODE_ENV !== "production") return true;

  if (!env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL não configurada em produção");
  }

  return env.FRONTEND_URL.split(",")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
};

export async function buildServer() {
  const fastify = Fastify({
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

  // Registrar plugins de segurança
  await fastify.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === "production",
    hidePoweredBy: true, // Remove header X-Powered-By
  });

  // Registrar CORS
  await fastify.register(cors, {
    origin: getAllowedOrigins(), // Em desenvolvimento permite qualquer origem
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Registrar Rate Limit
  await rateLimitPlugin(fastify);

  // Registrar Swagger (documentação)
  await swaggerPlugin(fastify);

  // Configurar JWT
  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Decorator para verificar autenticação
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({
          error: "Token inválido ou ausente",
          code: "UNAUTHORIZED",
        });
      }
    }
  );

  // Decorator para verificar role do usuário
  fastify.decorate("requireRole", function (roles: "SUPER_USER"[]) {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();

        const userRole = request.user.role;

        if (!roles.includes(userRole as "SUPER_USER")) {
          return reply.status(403).send({
            error: "Acesso negado. Permissão insuficiente.",
            code: "FORBIDDEN",
          });
        }
      } catch (err) {
        reply.status(401).send({
          error: "Token inválido ou ausente",
          code: "UNAUTHORIZED",
        });
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

  // Health check separado (para monitoramento)
  fastify.get("/health", async () => {
    // Você pode adicionar checks de banco, etc
    return {
      status: "healthy",
      uptime: process.uptime(),
    };
  });

  // Registrar rotas de autenticação com versionamento (v1)
  await fastify.register(authRoutes, { prefix: "/v1/auth" });

  // Manter compatibilidade com versão antiga (sem v1)
  await fastify.register(authRoutes, { prefix: "/auth" });

  // Registrar rotas de usuários
  await fastify.register(userRoutes, { prefix: "/v1/users" });
  await fastify.register(userRoutes, { prefix: "/users" });

  // Registrar rotas de produtos
  await fastify.register(productRoutes, { prefix: "/v1/products" });
  await fastify.register(productRoutes, { prefix: "/products" });

  // Registrar rotas de posts
  await fastify.register(postRoutes, { prefix: "/v1/posts" });
  await fastify.register(postRoutes, { prefix: "/posts" });

  // Registrar rotas de questions
  await fastify.register(questionRoutes, { prefix: "/v1/questions" });
  await fastify.register(questionRoutes, { prefix: "/questions" });

  // Registrar rotas de diary
  await fastify.register(diaryRoutes, { prefix: "/v1/diary" });
  await fastify.register(diaryRoutes, { prefix: "/diary" });

  // Registrar rotas de fraquezas-ameacas-sh
  await fastify.register(fraquezasAmeacasShRoutes, {
    prefix: "/v1/fraquezas-ameacas-sh",
  });
  await fastify.register(fraquezasAmeacasShRoutes, {
    prefix: "/fraquezas-ameacas-sh",
  });

  // Registrar rotas de fraquezas-ameacas-ch
  await fastify.register(fraquezasAmeacasChRoutes, {
    prefix: "/v1/fraquezas-ameacas-ch",
  });
  await fastify.register(fraquezasAmeacasChRoutes, {
    prefix: "/fraquezas-ameacas-ch",
  });

  // Registrar rotas de fraquezas-oportunidades
  await fastify.register(fraquezasOportunidadesRoutes, {
    prefix: "/v1/fraquezas-oportunidades",
  });
  await fastify.register(fraquezasOportunidadesRoutes, {
    prefix: "/fraquezas-oportunidades",
  });

  // Registrar rotas de historias-sociais
  await fastify.register(historiasSociaisRoutes, {
    prefix: "/v1/historias-sociais",
  });
  await fastify.register(historiasSociaisRoutes, {
    prefix: "/historias-sociais",
  });

  // Registrar rotas de forcas
  await fastify.register(forcasRoutes, { prefix: "/v1/forcas" });
  await fastify.register(forcasRoutes, { prefix: "/forcas" });

  // Registrar rotas de questionario-resposta
  await fastify.register(questionarioRespostaRoutes, {
    prefix: "/v1/questionario-resposta",
  });
  await fastify.register(questionarioRespostaRoutes, {
    prefix: "/questionario-resposta",
  });

  // Registrar rotas de traco-detalhe
  await fastify.register(tracoDetalheRoutes, { prefix: "/v1/traco-detalhe" });
  await fastify.register(tracoDetalheRoutes, { prefix: "/traco-detalhe" });

  // Registrar rotas de reflexao-traco
  await fastify.register(reflexaoTracoRoutes, { prefix: "/v1/reflexao-traco" });
  await fastify.register(reflexaoTracoRoutes, { prefix: "/reflexao-traco" });

  return fastify;
}
