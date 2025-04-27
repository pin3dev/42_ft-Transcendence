# api-gateway/Dockerfile

FROM node:20.18.1

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "src/server.js"]