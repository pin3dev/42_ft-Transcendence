const db_tournament = require("./tournaments_sql");
const db_players = require("./players_sql");

const util = require("util");

const run = util.promisify(db_tournament.run).bind(db_tournament);
const prepare = db_players.prepare.bind(db_players);

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
  insertPlayers,
};
