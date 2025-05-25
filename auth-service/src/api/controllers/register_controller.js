const { registerUser } = require("../../application/registerUser");

async function register_controller(request, reply) {
  console.log("[Auth-Service] Requisição recebida no /auth/register");
  console.log("[Auth-Service] Body:", request.body);
  const { email, password } = request.body;

  try {
    const result = await registerUser(email, password, {
      userRepo: request.server.userRepo,
      hasher: request.server.hasher
    });

    console.log("[Auth-Service] Registro bem-sucedido:", result);

    return reply.code(201).send({
      user_id: result.user_id,
      message: "Usuário criado com sucesso",
      qr_code: result.qr_code // considere renomear para `qr_code` no registerUser também
    });

  } catch (err) {
    console.error("[Auth-Service] Erro no registro:", err.message);
    return reply.code(400).send({ error: err.message });
  }
}

module.exports = { register_controller };
