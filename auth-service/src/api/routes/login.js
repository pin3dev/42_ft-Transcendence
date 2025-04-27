const { loginBody, loginResponse } = require("../schemas/userSchemas");
const { loginUser } = require("../../application/use_cases/loginUser");

module.exports = async function (fastify) {
  fastify.post("/login", {
    schema: {
      body: loginBody,
      response: loginResponse
    }
  }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      const result = await loginUser(email, password, {
        userRepo: fastify.userRepo,
        hasher: fastify.hasher
      });

      reply.code(200).send({
        userId: result.userId,
        message: "Login realizado com sucesso"
      });

    } catch (err) {
      reply.code(401).send({ error: err.message });
    }
  });
};
