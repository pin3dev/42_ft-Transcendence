# api-gateway/Dockerfile
FROM node:20.18.1

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 1025
CMD ["node", "src/server.js"]
