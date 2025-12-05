FROM oven/bun:1-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json bun.lockb* ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

# Instalar dependências
RUN bun install --frozen-lockfile || bun install

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN bun x prisma generate

# Expor porta
EXPOSE 3000

# Script de inicialização
CMD ["sh", "-c", "bun x prisma migrate deploy && bun run dev"]
