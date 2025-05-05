#!/bin/sh

mkdir -p /app/keys

echo "🚀 Iniciando entrypoint do Auth Service..."

# Gera chave privada se ainda não existir
if [ ! -f /app/keys/private.key ]; then
  echo "🔐 Gerando chave privada RSA..."
  openssl genpkey -algorithm RSA -out /app/keys/private.key -pkeyopt rsa_keygen_bits:2048
fi

# Gera chave pública com base na privada, se ainda não existir
if [ ! -f /app/keys/public.key ]; then
  echo "🔐 Gerando chave pública a partir da privada..."
  openssl rsa -pubout -in /app/keys/private.key -out /app/keys/public.key
fi

# Confirma conteúdo (debug)
echo "📄 Conteúdo atual das chaves:"
ls -l /app/keys

# Inicia o servidor
echo "🟢 Iniciando servidor..."
node src/server.js
