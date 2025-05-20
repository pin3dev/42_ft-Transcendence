const speakeasy = require("speakeasy");

async function twoFA_controller(request, reply) {
  const { user_id, otp } = request.body;

  const user = await request.server.userRepo.findById(user_id);

  if (!user || !user.twoFASecret) {
    return reply.code(401).send({ error: "2FA não configurado" });
  }

  const valid = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: "base32",
    token: otp
  });

  if (!valid) {
    return reply.code(401).send({ error: "Código inválido" });
  }

  if (!user.first2FALoginDone) {
    await request.server.userRepo.markFirst2FALoginDone(user.id);
  }

  const jwtToken = await request.server.jwt.sign(
    {
      user_id: user.id,
      email: user.email
    },
    { expiresIn: "1h" }
  );

  return reply.code(200).send({
    user_id: user.id,
    jwt: jwtToken,
    message: "2FA verificado com sucesso"
  });
}

module.exports = { twoFA_controller };
