const { subscribeToEvent, EventTypes } = require("../pckg/redis/modules.js");
const db = require("../db/init");

subscribeToEvent(EventTypes.MATCH_FINISHED, async (event) => {
  const {
    id,
    tournamentId,
    player1Id,
    player2Id,
    winnerId,
    score,
    startedAt,
    endedAt
  } = event.data;

  db.run(
    `INSERT OR IGNORE INTO matches (
      id, tournament_id, player1_id, player2_id, winner_id, score, started_at, ended_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, tournamentId, player1Id, player2Id, winnerId, score, startedAt, endedAt],
    (err) => {
      if (err) return console.error("Erro ao inserir partida:", err.message);
      console.log(`📊 Partida ${id} do torneio ${tournamentId} registrada.`);
    }
  );
});
