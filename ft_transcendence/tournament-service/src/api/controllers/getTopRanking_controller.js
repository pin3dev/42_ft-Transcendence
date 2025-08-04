const { getTopPlayers } = require("../../application/getTopPlayers");

async function getTopRanking_controller(request, reply) {
  try {
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : 5;
    const topPlayers = await getTopPlayers(limit);
    reply.code(200).send(topPlayers);
  } catch (err) {
    console.error("Detalhes do erro:", err);
    reply.code(500).send({ error: "Erro ao recuperar ranking de jogadores." });
  }
}

module.exports = { getTopRanking_controller };
