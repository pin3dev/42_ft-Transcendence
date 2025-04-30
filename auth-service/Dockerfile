# auth-service/Dockerfile
#FROM node:20.18.1

#WORKDIR /app

# Primeiro, instala utilitários do sistema que podem ser necessários
#RUN apt-get update && apt-get install -y sqlite3

# Copia os arquivos de dependências
#COPY package*.json ./

# Instala os pacotes npm
#RUN npm install

# Copia o restante do código da aplicação
#COPY . .

# 🔐 Cria diretório de chaves se não existir (DEVE SER SUBSTITUIDO EM PRODUÇÃO POR PASSAGEM DE CHAVES POR DOCKER SECRETS)
#RUN mkdir -p keys

# 🔐 Gera par de chaves automaticamente se não existirem (DEVE SER SUBSTITUIDO EM PRODUÇÃO POR PASSAGEM DE CHAVES POR DOCKER SECRETS)
#RUN test -f keys/private.key || openssl genpkey -algorithm RSA -out keys/private.key -pkeyopt rsa_keygen_bits:2048
#RUN test -f keys/public.key || openssl rsa -pubout -in keys/private.key -out keys/public.key

# Expõe a porta 4000
#EXPOSE 4000

# Comando para iniciar o servidor
#CMD ["node", "src/server.js"]

# auth-service/Dockerfile
FROM node:20.18.1

WORKDIR /app

# Instala utilitários necessários para o container (inclui openssl para geração das chaves)
RUN apt-get update && apt-get install -y sqlite3 openssl

# Copia os arquivos de dependência
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Garante que o script de entrada tenha permissão de execução
RUN chmod +x entrypoint.sh

# Expõe a porta 4000
EXPOSE 4000

# Usa script que gera as chaves e inicia o servidor
CMD ["sh", "./entrypoint.sh"]
