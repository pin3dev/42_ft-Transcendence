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

      if (result.status === "2FA_REQUIRED") {
        return reply.code(200).send({
          userId: result.userId,
          status: "2FA_REQUIRED",
          message: "Autenticação de dois fatores necessária"
        });
      }

    } catch (err) {
      reply.code(401).send({ error: err.message });
    }
  });
};
