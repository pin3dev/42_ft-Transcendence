const db = require("./matches_sql");
const util = require("util");

const run = util.promisify(db.run).bind(db);
const get = util.promisify(db.get).bind(db);

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

async function getStats(userId) {
  const winsRow = await get(`SELECT COUNT(*) as total FROM matches WHERE winner_id = ?`, [userId]);
  const lossesRow = await get(
    `SELECT COUNT(*) as total FROM matches WHERE (player1_id = ? OR player2_id = ?) AND winner_id != ?`,
    [userId, userId, userId]
  );

  return {
    totalWins: winsRow?.total || 0,
    totalLosses: lossesRow?.total || 0
  };
}

module.exports = { 
  insertMatch,
  getStats,
};