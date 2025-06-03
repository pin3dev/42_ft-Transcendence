const { getTopPlayersWithProfiles } = require("../../../application/getTopPlayers");

async function getTopRanking_controller(request, reply) {
  try {
    const topPlayers = await getTopPlayersWithProfiles();
    reply.code(200).send(topPlayers);
  } catch (err) {
    reply.code(500).send({ error: "Erro ao recuperar ranking." });
  }
}

module.exports = { getTopRanking_controller };
