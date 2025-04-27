const jwt = require("@fastify/jwt"); // *

async function authPlugin(fastify) { // *
  // Só para JWT futuramente
  fastify.register(jwt, {
    secret: process.env.JWT_PUBLIC_KEY,
    verify: { algorithms: ["RS256"] }
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Não autorizado" });
    }
  });
}

module.exports = authPlugin;
