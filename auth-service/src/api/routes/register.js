const { registerBody, registerResponse } = require("../schemas/userSchemas");
const { registerUser } = require("../../application/use_cases/registerUser");

module.exports = async function (fastify) {
  fastify.post("/register", {
    schema: {
      body: registerBody,
      response: registerResponse
    }
  }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      const result = await registerUser(email, password, {
        userRepo: fastify.userRepo,
        hasher: fastify.hasher
      });

      reply.code(201).send({
        userId: result.userId,
        message: "Usuário criado com sucesso",
        otpauthUrl: result.otpauthUrl // incluído para frontend gerar QR Code
      });

    } catch (err) {
      reply.code(400).send({ error: err.message });
    }
  });
};

