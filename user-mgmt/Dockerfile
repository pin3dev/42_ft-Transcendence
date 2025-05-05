FROM node:20.18.1

WORKDIR /app

RUN apt-get update && apt-get install -y sqlite3 

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
