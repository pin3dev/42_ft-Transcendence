FROM node:20.18.1-alpine

WORKDIR /app
# RUN apk add --no-cache tree

COPY package*.json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 443
CMD ["node", "src/server.js"]
