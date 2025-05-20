const { registerUser } = require("../../application/registerUser");

async function register_controller(request, reply) {
  const { email, password } = request.body;

  try {
    const result = await registerUser(email, password, {
      userRepo: request.server.userRepo,
      hasher: request.server.hasher
    });

    return reply.code(201).send({
      user_id: result.user_id,
      message: "Usuário criado com sucesso",
      qr_code: result.qr_code // considere renomear para `qr_code` no registerUser também
    });

  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
}

module.exports = { register_controller };
