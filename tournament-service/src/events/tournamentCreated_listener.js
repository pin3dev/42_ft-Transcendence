// /tournament-service/listeners/tournamentCreated.listener.js
const { subscribeToEvent, EventTypes } = require("../../pckg/redis/modules.js");
const { insertTournament, insertPlayers } = require("../infrastructure/db/tournament_repository");

subscribeToEvent(EventTypes.TOURNAMENT_CREATED, async (event) => {
  const { id, isPrivate, ownerId, password, started, createdAt, players } = event.data;

  try {
    await insertTournament({ id, isPrivate, ownerId, password, started, createdAt });
    console.log(`🏆 Torneio ${id} inserido.`);

    await insertPlayers(id, players);
    console.log(`🎮 Jogadores inseridos no torneio ${id}.`);
  } catch (err) {
    console.error("Erro ao processar torneio:", err.message);
  }
});
