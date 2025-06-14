FROM node:20.18.1

WORKDIR /app

COPY ./src .
RUN npm install

# Usa o entrypoint
RUN chmod +x entrypoint.sh

EXPOSE 3000
EXPOSE 3001

CMD ["./entrypoint.sh"]
