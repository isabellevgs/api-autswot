#!/bin/bash

# 🚀 Script de Setup do AutSWOT API
# Este script configura o banco de dados e executa as migrations

echo "🚀 AutSWOT - Setup da API"
echo "========================="
echo ""

# Verificar se o .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "📝 Criando arquivo .env..."
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autswot?schema=public"
JWT_SECRET="sua-chave-secreta-super-segura-mude-isso-em-producao"
PORT=3000
EOF
    echo "✅ Arquivo .env criado!"
    echo ""
    echo "⚠️  IMPORTANTE: Edite o arquivo .env e ajuste as credenciais do banco de dados!"
    echo ""
fi

# Carregar variáveis do .env
export $(cat .env | grep -v '^#' | xargs)

echo "📦 Instalando dependências..."
bun install
echo ""

echo "🗄️  Testando conexão com o banco de dados..."
bunx prisma db push --skip-generate 2>/dev/null
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro ao conectar no banco de dados!"
    echo ""
    echo "Por favor, verifique:"
    echo "1. PostgreSQL está rodando?"
    echo "2. O banco de dados 'autswot' foi criado? (execute: createdb autswot)"
    echo "3. As credenciais no .env estão corretas?"
    echo ""
    echo "Para criar o banco de dados, execute:"
    echo "  createdb autswot"
    echo ""
    exit 1
fi

echo "✅ Conexão com o banco OK!"
echo ""

echo "🔨 Executando migrations..."
bunx prisma migrate dev --name init
echo ""

echo "📊 Gerando Prisma Client..."
bunx prisma generate
echo ""

echo "✅ Setup concluído com sucesso!"
echo ""
echo "Para iniciar a API, execute:"
echo "  bun run start"
echo ""
echo "Para visualizar o banco de dados:"
echo "  bunx prisma studio"
echo ""

