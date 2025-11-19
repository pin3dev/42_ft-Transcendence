FROM node:20.18.1-alpine3.20 

WORKDIR /app
RUN mkdir -p /app/avatars
RUN apk add --no-cache sqlite sqlite-libs openssl

COPY package*.json ./
RUN npm install
COPY . .

RUN chmod +x /app/entrypoint.sh

CMD ["./entrypoint.sh"]