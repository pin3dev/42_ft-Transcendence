const db = require("./ranking_sql");
const util = require("util");

const run = util.promisify(db.run).bind(db);
const all = util.promisify(db.all).bind(db);
const get = util.promisify(db.get).bind(db);

async function getOrCreateRanking(playerId) {
  const row = await get(
    "SELECT player_id, score FROM ranking WHERE player_id = ?",
    [playerId]
  );

  if (row) return row;

  await createRanking(playerId, 1200);
  return { player_id: playerId, score: 1200 };
}

async function createRanking(playerId, score) {
  await run(
    `INSERT INTO ranking (player_id, score, last_updated)
     VALUES (?, ?, datetime('now'))`,
    [playerId, score]
  );
}

async function updateRanking(playerId, newScore) {
  await run(
    `UPDATE ranking SET score = ?, last_updated = datetime('now')
     WHERE player_id = ?`,
    [newScore, playerId]
  );
}

function calculateElo(winnerScore, loserScore) {
  const K = 32;
  const expectedWinner = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
  const expectedLoser = 1 - expectedWinner;

  const newWinner = Math.round(winnerScore + K * (1 - expectedWinner));
  const newLoser = Math.round(loserScore + K * (0 - expectedLoser));

  return { newWinner, newLoser };
}

async function getTopPlayers(limit = 5) {
  return await all(
    `SELECT player_id, score FROM player_ranking ORDER BY score DESC LIMIT ?`,
    [limit]
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
  getOrCreateRanking,
  updateRanking,
  calculateElo,
  getTopPlayers,
  getStats
};
