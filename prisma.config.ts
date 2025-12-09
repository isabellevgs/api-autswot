import { defineConfig } from "prisma/config";

// Carregar variáveis do .env com fallback para operações que não precisam de conexão real (como generate)
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/autswot?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun run prisma/seed.ts",
  },
  datasource: {
    url: DATABASE_URL,
  },
});
