# Usa imagem oficial do Node
FROM node:20.18.1

# Define diretório de trabalho
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Copia apenas os arquivos de dependência para instalar primeiro (cache eficiente)
COPY package*.json ./

# Instala dependências dentro do container
RUN npm install

# Copia o restante do código
COPY . .

# Cria diretório do banco se não existir
RUN mkdir -p /app/data

# Comando padrão de execução
CMD ["node", "src/server.js"]
