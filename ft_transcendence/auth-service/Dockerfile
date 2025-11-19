FROM node:20.18.1-slim

WORKDIR /app
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*
    
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "src/server.js"]
