const updateUserProfile = require("../../application/updateUserProfile");

async function updateUser_controller(request, reply) {
  const userId = request.headers["x-user-id"];
  if (!userId) {
    return reply.code(401).send({ error: "Unauthorized: missing user ID" });
  }

  console.log('📥 Corpo da requisição (bruto):', request.body);
  console.log('🧪 Tipo do campo name:', typeof request.body.name);

  if (request.body?.name) {
    if (Buffer.isBuffer(request.body.name)) {
      console.log('📦 Campo name como Buffer:', request.body.name.toString('utf8'));
    } else {
      console.log('📦 Campo name como string:', request.body.name);
    }
  }


  if (request.body?.name && request.body.name?.value) {
    try {
      request.body.name = JSON.parse(request.body.name.value);
      console.log('✅ Campo name após parse do .value:', request.body.name);
    } catch (e) {
      console.warn('❌ Falha ao converter name.value:', request.body.name.value);
    }
  }

  try {
    const result = await updateUserProfile(userId, request.body);
    return reply.send(result);
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    const status = err.statusCode || 500;
    return reply.code(status).send({ error: err.message });
  }
}

module.exports = {
  updateUser_controller,
};
