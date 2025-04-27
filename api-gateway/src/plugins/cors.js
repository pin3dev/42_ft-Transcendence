const fastifyCors = require("@fastify/cors");

async function corsPlugin(fastify) {
  fastify.register(fastifyCors, {
    origin: ["http://localhost:3000"], // ou "*" pra testes
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  });
}

module.exports = corsPlugin;
