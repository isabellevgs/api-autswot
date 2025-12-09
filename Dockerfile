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
# Executa migrations, seed e inicia o servidor
# Usa NODE_ENV para determinar se é produção ou desenvolvimento
CMD ["sh", "-c", "echo '🚀 Iniciando aplicação...' && echo '📊 Executando migrations...' && bun x prisma migrate deploy && echo '🌱 Executando seed...' && bun x prisma db seed && echo '✅ Seed concluído!' && if [ \"$NODE_ENV\" = \"production\" ]; then echo '🏭 Iniciando em modo produção...' && bun run start; else echo '🔧 Iniciando em modo desenvolvimento...' && bun run dev; fi"]
