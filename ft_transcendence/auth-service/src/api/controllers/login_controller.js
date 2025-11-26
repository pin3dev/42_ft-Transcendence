const { loginUser } = require("../../application/loginUser");

async function login_controller(request, reply) {
  const { email, password } = request.body;

  // login attempts metric
  request.server.metrics.authLoginAttempts.inc();

  try {
    const result = await loginUser(email, password, {
      userRepo: request.server.userRepo,
      hasher: request.server.hasher
    });

    //console.logog("Resultado do loginUser:", result);

    if (result.status === "2FA_REQUIRED") {
      // login success metric
      request.server.metrics.authLoginSuccess.inc();
      request.server.metrics.activeSessions.inc();

      return reply.code(200).send({
        user_id: result.user_id,
        status: "2FA_REQUIRED",
        message: "Autenticação de dois fatores necessária",
        ...(result.qr_code && { qr_code: result.qr_code })
      });
    }

    // login failed metric
    request.server.metrics.authLoginFailed.inc();
    return reply.code(400).send({ error: "Estado inesperado" });

  } catch (err) {
    // login failed metric
    request.server.metrics.authLoginFailed.inc();
    return reply.code(401).send({ error: err.message });
  }
}

module.exports = { login_controller };
