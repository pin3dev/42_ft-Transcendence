FROM node:20.18.1-slim

WORKDIR /app
RUN mkdir -p /app/avatars
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    openssl \
    && rm -rf /var/lib/apt/lists/*
    
COPY package*.json ./
RUN npm install
COPY . .

RUN chmod +x /app/entrypoint.sh

CMD ["./entrypoint.sh"]