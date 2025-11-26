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

  // generate JWT token
  const jwtToken = await reply.jwtSign(
    {
      user_id: user.id,
      email: user.email
    },
    { expiresIn: "1h" }
  );

  // Define the cookie with the JWT token
  reply
    .setCookie('jwt', jwtToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true, // use 'true' in production with HTTPS
      path: '/',
      maxAge: 3600 // 1 hour
    })
    .code(200)
    .send({ message: "2FA verificado com sucesso" });
}

module.exports = { twoFA_controller };

