# api-gateway/Dockerfile
FROM node:20.18.1

WORKDIR /app
RUN apt-get update && apt-get install -y tree

COPY package*.json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 443
CMD ["node", "src/server.js"]
