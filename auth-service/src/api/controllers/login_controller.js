const { loginUser } = require("../../application/loginUser");

async function login_controller(request, reply) {
  const { email, password } = request.body;

  try {
    const result = await loginUser(email, password, {
      userRepo: request.server.userRepo,
      hasher: request.server.hasher
    });

    if (result.status === "2FA_REQUIRED") {
      return reply.code(200).send({
        user_id: result.user_id,
        status: "2FA_REQUIRED",
        message: "Autenticação de dois fatores necessária",
        ...(result.qr_code && { qr_code: result.qr_code })  // 🔁 usa qr_code diretamente
      });
    }

    // ⚠️ Se não for 2FA_REQUIRED, adicionar comportamento aqui se necessário
    return reply.code(400).send({ error: "Estado inesperado" });

  } catch (err) {
    return reply.code(401).send({ error: err.message });
  }
}

module.exports = { login_controller };
