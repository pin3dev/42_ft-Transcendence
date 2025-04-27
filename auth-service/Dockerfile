# auth-service/Dockerfile
FROM node:20.18.1

WORKDIR /app

# Primeiro, instala utilitários do sistema que podem ser necessários
RUN apt-get update && apt-get install -y sqlite3

# Copia os arquivos de dependências
COPY package*.json ./

# Instala os pacotes npm
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta 4000
EXPOSE 4000

# Comando para iniciar o servidor
CMD ["node", "src/server.js"]
