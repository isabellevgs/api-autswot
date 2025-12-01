import { defineConfig } from "prisma/config";

// Carregar variáveis do .env
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://isabellevargas:@localhost:5432/autswot?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: DATABASE_URL,
  },
});
