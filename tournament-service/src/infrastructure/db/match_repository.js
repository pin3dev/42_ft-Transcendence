// /tournament-service/repositories/match.repository.js
const db = require("./matches_sql");

function insertMatch(match) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO matches (
        id, tournament_id, player1_id, player2_id, winner_id, score, started_at, ended_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        match.id,
        match.tournamentId,
        match.player1Id,
        match.player2Id,
        match.winnerId,
        match.score,
        match.startedAt,
        match.endedAt
      ],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

module.exports = { insertMatch };
