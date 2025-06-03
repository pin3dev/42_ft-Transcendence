const { getUserStats } = require("../../../application/getUserStats");

async function getUserStats_controller(request, reply) {
  const userId = request.headers["x-user-id"];

  if (!userId) {
    return reply.code(401).send({ error: "Usuário não autenticado." });
  }

  try {
    const stats = await getUserStats(userId);
    reply.code(200).send(stats);
  } catch (err) {
    reply.code(500).send({ error: "Erro ao recuperar estatísticas do usuário." });
  }
}

module.exports = { getUserStats_controller };