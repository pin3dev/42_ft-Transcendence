# api-gateway/Dockerfile
FROM node:20.18.1

WORKDIR /app
# Instala utilitários necessários para o container (inclui openssl para geração das chaves)
RUN apt-get update && apt-get install -y sqlite3 openssl

# Copia os arquivos de dependência
COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 3000

CMD ["sh", "./entrypoint.sh"]
