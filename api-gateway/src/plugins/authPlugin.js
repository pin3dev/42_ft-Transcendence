const jwt = require("@fastify/jwt");
const fs = require("fs");
const path = require("path");

async function authPlugin(fastify) {
  // Registra o JWT com a chave pública (somente leitura)
  const publicKey = fs.readFileSync("/app/keys/public.key");

  await fastify.register(jwt, {
    secret: async () => publicKey,  // ✅ resolve o erro
    verify: { algorithms: ["RS256"] },
    sign: false                     // ✅ previne criação de signer
  });

  // Decora a função authenticate (middleware)
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify(); // verifica token no header Authorization
    } catch (err) {
      reply.code(401).send({ error: "Token inválido ou ausente" });
    }
  });
}

module.exports = authPlugin;
