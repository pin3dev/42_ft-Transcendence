const fastifyCors = require("@fastify/cors");

async function corsPlugin(fastify) {
  console.log("Registrando middleware de CORS...");
  fastify.register(fastifyCors, {
    origin: ["http://localhost:3000"], // Permitir o frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Inclua OPTIONS
    credentials: true,
    preflightContinue: false, // Garante que o Fastify responde automaticamente às preflight requests
  });
  console.log("Middleware de CORS registrado com sucesso.");
}

module.exports = corsPlugin;


