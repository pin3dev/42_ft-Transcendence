const { registerUser } = require("../../application/registerUser");

async function register_controller(request, reply) {
  //console.logog("[Auth-Service] Requisição recebida no /auth/register");
  //console.logog("[Auth-Service] Body:", request.body);
  const { email, password } = request.body;

  try {
    const result = await registerUser(email, password, {
      userRepo: request.server.userRepo,
      hasher: request.server.hasher
    });

    //console.logog("[Auth-Service] Registro bem-sucedido:", result);

    // account created metric
    request.server.metrics.authAccountCreated.inc();
    return reply.code(201).send({
      user_id: result.user_id,
      message: "Usuário criado com sucesso",
      qr_code: result.qr_code 
    });

  } catch (err) {
    console.error("[Auth-Service] Erro no registro:", err.message);
    // account create failed metric
    request.server.metrics.authAccountCreateFailed.inc();
    return reply.code(400).send({ error: err.message });
  }
}

module.exports = { register_controller };
