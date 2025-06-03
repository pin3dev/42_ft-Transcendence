const db = require("./matches_sql");
const util = require("util");

const run = util.promisify(db.run).bind(db);

async function insertMatch(match) {
  await run(
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
    ]
  );
}

module.exports = { insertMatch };