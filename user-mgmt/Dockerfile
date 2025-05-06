FROM node:20.18.1

WORKDIR /app

# RUN apt-get update && apt-get install -y sqlite3 
# Instala dependências do sistema (sem cache sujo)
RUN apt-get update && \
    apt-get install -y --no-install-recommends sqlite3 && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
