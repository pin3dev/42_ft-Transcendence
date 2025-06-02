const db = require("../db/ranking_sql");

// Cria ou retorna o ranking de um jogador
function getOrCreateRanking(playerId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT player_id, score FROM ranking WHERE player_id = ?",
      [playerId],
      async (err, row) => {
        if (err) return reject(err);
        if (row) return resolve(row);

        // Não encontrado, cria com score inicial
        try {
          await createRanking(playerId, 1200);
          return resolve({ player_id: playerId, score: 1200 });
        } catch (createErr) {
          return reject(createErr);
        }
      }
    );
  });
}

function createRanking(playerId, score) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO ranking (player_id, score, last_updated)
       VALUES (?, ?, datetime('now'))`,
      [playerId, score],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

function updateRanking(playerId, newScore) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE ranking SET score = ?, last_updated = datetime('now')
       WHERE player_id = ?`,
      [newScore, playerId],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

// Cálculo de ELO simplificado
function calculateElo(winnerScore, loserScore) {
  const K = 32;
  const expectedWinner = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
  const expectedLoser = 1 - expectedWinner;

  const newWinner = Math.round(winnerScore + K * (1 - expectedWinner));
  const newLoser = Math.round(loserScore + K * (0 - expectedLoser));

  return { newWinner, newLoser };
}

module.exports = {
  getOrCreateRanking,
  updateRanking,
  calculateElo,
};
