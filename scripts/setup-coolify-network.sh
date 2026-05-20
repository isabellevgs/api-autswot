#!/usr/bin/env sh
# Conecta app, admin e API na rede Docker compartilhada "coolify".
# Rode na VPS após deploy (ou adicione como post-deploy no Coolify).
set -eu

NETWORK="coolify"
CONTAINERS="autswot-api autswot-app autswot-admin"

echo "→ Verificando rede ${NETWORK}..."
if ! docker network inspect "${NETWORK}" >/dev/null 2>&1; then
  docker network create "${NETWORK}"
  echo "  Rede ${NETWORK} criada."
else
  echo "  Rede ${NETWORK} já existe."
fi

echo "→ Conectando containers..."
for name in ${CONTAINERS}; do
  if docker ps -a --format '{{.Names}}' | grep -qx "${name}"; then
    if docker network connect "${NETWORK}" "${name}" 2>/dev/null; then
      echo "  ${name}: conectado."
    else
      echo "  ${name}: já estava na rede."
    fi
  else
    echo "  ${name}: não encontrado (ignorado)."
  fi
done

echo "→ Testando app → API..."
if docker ps --format '{{.Names}}' | grep -qx autswot-app; then
  if docker exec autswot-app wget -qO- --timeout=5 http://autswot-api:3000/health; then
    echo ""
    echo "✅ Conectividade OK (autswot-app → autswot-api:3000)"
  else
    echo ""
    echo "❌ Falha: autswot-app não alcança autswot-api:3000"
    echo "   Verifique se autswot-api está rodando: docker logs autswot-api --tail 30"
    exit 1
  fi
else
  echo "  autswot-app não está rodando; pulando teste."
fi
