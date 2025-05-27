const updateUserProfile = require("../../application/updateUserProfile");

async function updateUser_controller(request, reply) {
  const userId = request.headers["x-user-id"];
  if (!userId) {
    return reply.code(401).send({ error: "Unauthorized: missing user ID" });
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
