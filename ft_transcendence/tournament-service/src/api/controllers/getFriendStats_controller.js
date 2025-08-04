const { getUserStats } = require("../../application/getUserStats");

async function getFriendStats_controller(request, reply) {
  try {
    const userId = request.query.user_id;
    
    if (!userId) {
      return reply.code(400).send({ error: "user_id parameter is required" });
    }
    
    const userStats = await getUserStats(userId);
    reply.code(200).send(userStats);
  } catch (err) {
    console.error("Erro ao recuperar estatísticas do usuário:", err);
    reply.code(500).send({ error: "Erro ao recuperar estatísticas do usuário." });
  }
}

module.exports = { getFriendStats_controller };