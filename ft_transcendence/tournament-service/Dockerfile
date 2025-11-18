FROM node:20.18.1-alpine

WORKDIR /app

RUN apk add --no-cache sqlite sqlite-libs openssl

COPY package*.json ./

RUN npm ci

COPY . .
RUN npx prisma generate --schema=src/infrastructure/schema.prisma

RUN mkdir -p /app/data

CMD ["sh", "-c", "npx prisma db push --schema=src/infrastructure/schema.prisma && node src/server.js"]

