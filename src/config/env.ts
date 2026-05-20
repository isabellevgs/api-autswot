import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET deve ter pelo menos 32 caracteres"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET deve ter pelo menos 32 caracteres"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  FRONTEND_URL: z.string().min(1).default("http://localhost:5173,http://localhost:5174,http://localhost:3001"),
});

// Validar e exportar variáveis de ambiente
export const env = envSchema.parse(process.env);

const abbrev = (s: string, n = 4) => s.slice(0, n) + "***";
console.info("🔐 Env carregada:", {
  DATABASE_URL: abbrev(env.DATABASE_URL, 30),
  JWT_SECRET: `${abbrev(env.JWT_SECRET)} [${env.JWT_SECRET.length}chars]`,
  JWT_REFRESH_SECRET: `${abbrev(env.JWT_REFRESH_SECRET)} [${env.JWT_REFRESH_SECRET.length}chars]`,
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
});
