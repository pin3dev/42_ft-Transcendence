FROM node:20.18.1-alpine

WORKDIR /app
RUN apk add --no-cache sqlite sqlite-libs

COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "src/server.js"]
