# Use imagem base do Node.js
FROM node:18

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos
COPY package*.json ./

# Instale as dependências
RUN npm install

COPY . .

# Crie a pasta de dados do SQLite (se necessário)
RUN mkdir -p /app/data

# Porta interna usada (apenas se quiser expor algo futuramente)
EXPOSE 6000

# Comando de inicialização
CMD ["node", "src/index.js"]
