#!/bin/bash

mkdir -p secrets

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
