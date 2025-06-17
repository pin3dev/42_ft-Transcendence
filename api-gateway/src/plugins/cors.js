const fastifyCors = require("@fastify/cors");

async function corsPlugin(fastify) {
  //console.logog("Registrando middleware de CORS...");
  fastify.register(fastifyCors, {
    origin: ["https://localhost"], // Permitir o frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Inclua OPTIONS
    credentials: true,
    preflightContinue: false, // Garante que o Fastify responde automaticamente às preflight requests
  });
  //console.logog("Middleware de CORS registrado com sucesso.");
}

module.exports = corsPlugin;


