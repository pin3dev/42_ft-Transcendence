#!/bin/sh

mkdir -p /app/keys

echo "🚀 Iniciando API Gateway..."

echo "$PUBLIC_KEY_BASE64" | base64 -d > /app/keys/public.key

echo "✅ Chave pública restaurada:"
ls -l /app/keys

node src/server.js
