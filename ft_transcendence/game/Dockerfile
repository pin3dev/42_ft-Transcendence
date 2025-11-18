FROM node:20.18.1-alpine

WORKDIR /app
RUN apk add --no-cache make

COPY . .
RUN npm install

# Usa o entrypoint
RUN chmod +x entrypoint.sh

EXPOSE 3000
EXPOSE 3001

CMD ["./entrypoint.sh"]
