#!/bin/bash

set -e

# ==============================
# Função: Detecta sistema operacional e define o comando base64 compatível
# ==============================
detect_base64_cmd() {
  case "$(uname -s)" in
    Darwin) BASE64_CMD="base64" ;;
    Linux) BASE64_CMD="base64 -w 0" ;;
    CYGWIN*|MINGW*|MSYS*) BASE64_CMD="base64 -w 0" ;;
    *) echo "❌ Sistema operacional não suportado"; exit 1 ;;
  esac
}

# ==============================
# Função: Detecta o IP local baseado no sistema operacional
# ==============================
detect_local_ip() {
  case "$(uname -s)" in
    Darwin) 
      LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")
      ;;
    Linux) 
      LOCAL_IP=$(ip route get 8.8.8.8 | grep -oP 'src \K\S+' 2>/dev/null || echo "127.0.0.1")
      ;;
    *) 
      LOCAL_IP="127.0.0.1"
      ;;
  esac
  echo "🌐 IP local detectado: $LOCAL_IP"
}

# ==============================
# Função: Instala mkcert no macOS
# ==============================
install_mkcert_mac() {
  echo "🍏 Instalando mkcert via Homebrew..."
  if ! command -v brew >/dev/null 2>&1; then
    echo "❌ Homebrew não encontrado. Instale manualmente: https://brew.sh/"
    exit 1
  fi
  brew install mkcert
  mkcert -install
}

# ==============================
# Função: Instala mkcert no Linux (Debian/Ubuntu)
# ==============================
install_mkcert_linux() {
  echo "🐧 Instalando mkcert em ambiente Linux..."
  sudo apt-get update || echo "⚠️ Falha no apt-get update (ignorado)"
  sudo apt-get install -y libnss3-tools curl || echo "⚠️ Falha ao instalar libnss3-tools e curl (ignorado)"
  curl -JLO https://dl.filippo.io/mkcert/latest?for=linux/amd64
  chmod +x mkcert-*-linux-amd64
  sudo mv mkcert-*-linux-amd64 /usr/local/bin/mkcert
  mkcert -install
}

# ==============================
# Função: Gera as chaves RSA para JWT
# ==============================
generate_jwt_keys() {
  mkdir -p secrets

  if [ ! -f secrets/private.key ]; then
    echo "🔐 Gerando chave privada JWT..."
    openssl genpkey -algorithm RSA -out secrets/private.key -pkeyopt rsa_keygen_bits:2048
  fi

  if [ ! -f secrets/public.key ]; then
    echo "🔐 Gerando chave pública JWT..."
    openssl rsa -pubout -in secrets/private.key -out secrets/public.key
  fi

  PRIVATE_KEY=$($BASE64_CMD < secrets/private.key | tr -d '\n')
  PUBLIC_KEY=$($BASE64_CMD < secrets/public.key | tr -d '\n')
}

# ==============================
# Função: Gera certificados SSL com mkcert
# ==============================
generate_ssl_certificates() {
  if ! command -v mkcert >/dev/null 2>&1; then
    echo "⚠️  mkcert não encontrado. Instalando..."
    OS="$(uname -s)"
    case "$OS" in
      Darwin) install_mkcert_mac ;;
      Linux) install_mkcert_linux ;;
      *) echo "❌ Sistema não suportado para instalação automática de mkcert: $OS"; exit 1 ;;
    esac
  fi

  detect_local_ip
  
  mkdir -p certs
  LOCAL_IP_BASE64=$(echo -n "$LOCAL_IP" | base64)

  if [ ! -f certs/localhost.pem ] || [ ! -f certs/localhost-key.pem ]; then
    echo "🔐 Gerando certificados SSL com mkcert..."
    mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost 127.0.0.1 ::1 $LOCAL_IP transcendence.local
    
  else
    echo "ℹ️  Certificados SSL já existem. Pulando geração."
  fi

  SSL_CERT=$($BASE64_CMD < certs/localhost.pem | tr -d '\n')
  SSL_KEY=$($BASE64_CMD < certs/localhost-key.pem | tr -d '\n')
}

# ==============================
# Função: Cria o arquivo .env com seções separadas
# ==============================
create_env_file() {
  cat <<EOF > .env
# ===================== JWT Keys =====================
# Chaves RSA em Base64 para autenticação JWT
JWT_PRIVATE_KEY_BASE64=$PRIVATE_KEY
JWT_PUBLIC_KEY_BASE64=$PUBLIC_KEY

# ===================== SSL Certs =====================
# Certificado e chave privada SSL para HTTPS (base64)
SSL_CERT_BASE64=$SSL_CERT
SSL_KEY_BASE64=$SSL_KEY

# ===================== Network Configuration =====================
LOCAL_IP_BASE64=$LOCAL_IP_BASE64
EOF

  echo "✅ Arquivo .env criado com sucesso."
}

# ==============================
# Função: Limpa arquivos temporários sensíveis
# ==============================
cleanup() {
  cp "$(mkcert -CAROOT)/rootCA.pem" ./transcendence.pem
  rm -rf secrets
  rm -rf certs
  echo "🧹 Diretórios 'secrets' e 'certs' removido por segurança."
}

# ==============================
# Execução principal
# ==============================
echo "🚀 Iniciando geração de variáveis sensíveis..."
detect_base64_cmd
generate_jwt_keys
generate_ssl_certificates
create_env_file
cleanup
