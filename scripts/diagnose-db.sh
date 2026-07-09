#!/usr/bin/env sh
# Diagnóstico de conectividade API ↔ PostgreSQL na VPS/Coolify.
set -eu

pass() { echo "  ✅ $*"; }
fail() { echo "  ❌ $*"; }
warn() { echo "  ⚠️  $*"; }

echo "========== Diagnóstico PostgreSQL (api-autswot) =========="

API_CONTAINER=$(docker ps --filter "name=autswot-api" --format '{{.Names}}' | head -1)
POSTGRES_CONTAINER=$(docker ps --filter "name=autswot-postgres" --format '{{.Names}}' | head -1)

echo ""
echo "[1/5] Containers"
if [ -n "${API_CONTAINER}" ]; then
  pass "API: ${API_CONTAINER}"
else
  fail "API (autswot-api) não encontrada"
fi

if [ -n "${POSTGRES_CONTAINER}" ]; then
  pass "Postgres: ${POSTGRES_CONTAINER}"
else
  fail "Postgres (autswot-postgres) não encontrado — suba o stack: docker compose up -d postgres"
fi

echo ""
echo "[2/5] Rede coolify"
if docker network inspect coolify >/dev/null 2>&1; then
  pass "Rede coolify existe"
  members=$(docker network inspect coolify --format '{{range .Containers}}{{.Name}} {{end}}' 2>/dev/null || true)
  echo "      Membros: ${members:-nenhum}"
  case " ${members} " in
    *" ${API_CONTAINER:-__missing__} "*) pass "API na rede coolify" ;;
    *) warn "API NÃO está na rede coolify — rode: sh scripts/setup-coolify-network.sh" ;;
  esac
  case " ${members} " in
    *" ${POSTGRES_CONTAINER:-__missing__} "*) pass "Postgres na rede coolify" ;;
    *) warn "Postgres NÃO está na rede coolify — rode: sh scripts/setup-coolify-network.sh" ;;
  esac
else
  warn "Rede coolify não existe — rode: sh scripts/setup-coolify-network.sh"
fi

echo ""
echo "[3/5] DNS autswot-postgres (from API)"
if [ -n "${API_CONTAINER}" ]; then
  if docker exec "${API_CONTAINER}" getent hosts autswot-postgres >/dev/null 2>&1; then
    pass "autswot-postgres resolve → $(docker exec "${API_CONTAINER}" getent hosts autswot-postgres | awk '{print $1}' | head -1)"
  else
    fail "autswot-postgres NÃO resolve no container da API"
    echo "      Corrija: docker network connect --alias autswot-postgres coolify ${POSTGRES_CONTAINER}"
  fi
else
  warn "API ausente — pulando teste DNS"
fi

echo ""
echo "[4/5] Postgres aceitando conexões"
if [ -n "${POSTGRES_CONTAINER}" ]; then
  if docker exec "${POSTGRES_CONTAINER}" pg_isready -U autswot_user -d autswot >/dev/null 2>&1; then
    pass "pg_isready OK"
  else
    fail "Postgres não está pronto (pg_isready falhou)"
  fi
else
  warn "Postgres ausente — pulando pg_isready"
fi

echo ""
echo "[5/5] DATABASE_URL no container da API"
if [ -n "${API_CONTAINER}" ]; then
  db_host=$(docker exec "${API_CONTAINER}" sh -c 'echo "$DATABASE_URL"' | sed -n 's|.*@\([^:]*\):.*|\1|p')
  echo "      Host na DATABASE_URL: ${db_host:-desconhecido}"
  if [ "${db_host}" = "autswot-postgres" ]; then
    pass "DATABASE_URL aponta para autswot-postgres"
  else
    warn "DATABASE_URL usa host '${db_host}' — esperado autswot-postgres na rede coolify"
  fi
else
  warn "API ausente — pulando checagem DATABASE_URL"
fi

echo ""
echo "========== Fim do diagnóstico =========="
