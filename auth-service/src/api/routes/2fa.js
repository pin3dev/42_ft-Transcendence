const { twoFABody, twoFAResponse } = require("../schemas/userSchemas");
const speakeasy = require("speakeasy");

module.exports = async function (fastify) {
  fastify.post("/2fa/verify", {
    schema: {
      body: twoFABody,
      response: twoFAResponse
    }
  }, async (request, reply) => {
    const { userId, token } = request.body;

    const user = await fastify.userRepo.findById(userId);
    if (!user || !user.twoFASecret) {
      return reply.code(401).send({ error: "2FA não configurado" });
    }

    const valid = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token
    });

    if (!valid) {
      return reply.code(401).send({ error: "Código inválido" });
    }

    // ✅ Se o 2FA for validado, gera um JWT para o usuário
    const jwtToken = await fastify.jwt.sign({
      userId: user.id,
      email: user.email
    }, {
      expiresIn: "1h" // Token expira em 1 hora (ajustável)
    });

    return reply.code(200).send({
      userId: user.id,
      token: jwtToken,    // 🔥 Envia o token para o frontend
      message: "2FA verificado com sucesso"
    });
  });
};
/*const { twoFABody, twoFAResponse } = require("../schemas/userSchemas");

const speakeasy = require("speakeasy");

module.exports = async function (fastify) {
  fastify.post("/2fa/verify", {
    schema: {
        body: twoFABody,
        response: twoFAResponse
    }
  }, async (request, reply) => {
    const { userId, token } = request.body;

    const user = await fastify.userRepo.findById(userId);
    if (!user || !user.twoFASecret) {
      return reply.code(401).send({ error: "2FA não configurado" });
    }

    const valid = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token
    });

    if (!valid) {
      return reply.code(401).send({ error: "Código inválido" });
    }

    return reply.code(200).send({
      userId: user.id,
      message: "2FA verificado com sucesso"
    });
  });
};*/