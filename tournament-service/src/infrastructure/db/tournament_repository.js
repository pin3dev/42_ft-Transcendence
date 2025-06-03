const db = require("./tournaments_sql");
const util = require("util");

const run = util.promisify(db.run).bind(db);
const prepare = db.prepare.bind(db);

async function insertTournament(tournament) {
  await run(
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
    ]
  );
}

async function insertPlayers(tournamentId, players) {
  return new Promise((resolve, reject) => {
    const stmt = prepare(`
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
