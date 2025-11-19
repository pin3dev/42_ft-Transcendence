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
RUN npx prisma generate --schema=src/infrastructure/schema.prisma

RUN mkdir -p /app/data

CMD ["sh", "-c", "npx prisma db push --schema=src/infrastructure/schema.prisma && node src/server.js"]

