#!/bin/bash

set -e

mkdir -p secrets

# Detecta o sistema operacional
OS="$(uname -s)"

# Define o comando correto para base64
case "$OS" in
  Darwin)
    BASE64_CMD="base64"
    ;;
  Linux)
    BASE64_CMD="base64 -w 0"
    ;;
  CYGWIN*|MINGW*|MSYS*)
    BASE64_CMD="base64 -w 0"
    ;;
  *)
    echo "❌ Sistema operacional não suportado: $OS"
    exit 1
    ;;
esac

# Gera chaves se não existirem
if [ ! -f secrets/private.key ]; then
  openssl genpkey -algorithm RSA -out secrets/private.key -pkeyopt rsa_keygen_bits:2048
fi

if [ ! -f secrets/public.key ]; then
  openssl rsa -pubout -in secrets/private.key -out secrets/public.key
fi

# Codifica para base64
PRIVATE_KEY=$(base64 < secrets/private.key | tr -d '\n')
PUBLIC_KEY=$(base64 < secrets/public.key | tr -d '\n')

# Cria .env
cat <<EOF > .env
PRIVATE_KEY_BASE64=$PRIVATE_KEY
PUBLIC_KEY_BASE64=$PUBLIC_KEY
EOF

echo "✅ Arquivo .env criado com sucesso."
