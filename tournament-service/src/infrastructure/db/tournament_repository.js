const db = require("./tournaments_sql");

function insertTournament(tournament) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO tournaments (
        id, is_private, owner_id, password, started, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        tournament.id,
        tournament.isPrivate,
        tournament.ownerId,
        tournament.password || null,
        tournament.started,
        tournament.createdAt
      ],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

function insertPlayers(tournamentId, players) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO players (tournament_id, player_id)
      VALUES (?, ?)
    `);

    for (const playerId of players) {
      stmt.run(tournamentId, playerId);
    }

    stmt.finalize((err) => (err ? reject(err) : resolve()));
  });
}

module.exports = {
  insertTournament,
  insertPlayers
};
