# auth-service/Dockerfile
FROM node:20.18.1

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (para build cache funcionar)
COPY package*.json ./

# Instala dependências DENTRO do container (aqui já compila o sqlite3 certo)
RUN npm install

# Agora copia o resto dos arquivos da aplicação
COPY . .

EXPOSE 4000

CMD ["node", "src/server.js"]