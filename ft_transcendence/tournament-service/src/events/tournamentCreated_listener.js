const { subscribeToEvent, EventTypes } = require("../../pckg/redis/modules.js");
const { Tournament } = require("../domain/Tournament");
const { insertTournament, insertPlayers } = require("../infrastructure/repositories/tournament_repository");


function tournamentCreated_listener() {
  subscribeToEvent(EventTypes.TOURNAMENT_CREATED, async (event) => {
    //console.logog("🎧 Ouvindo TOURNAMENT_CREATED...");
    try {
      const tournament = new Tournament(event.data);

      if (!tournament.isValidPlayerCount()) {
        throw new Error("Quantidade inválida de jogadores");
      }

      await insertTournament(tournament);
      await insertPlayers(tournament.id, tournament.players);

      //console.logog(`🏆 Torneio ${tournament.id} inserido com ${tournament.players.length} jogadores.`);
    } catch (err) {
      console.error("Erro ao processar torneio:", err.message);
    }
  });
}

module.exports = {
  tournamentCreated_listener,
};