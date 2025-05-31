const { subscribeToEvent, EventTypes } = require("../pckg/redis/modules.js");
const db = require("../db/init");

subscribeToEvent(EventTypes.TOURNAMENT_CREATED, async (event) => {
  const { id, isPrivate, ownerId, password, started, createdAt, players } = event.data;

  db.serialize(() => {
    db.run(
      `INSERT OR IGNORE INTO tournaments (id, is_private, owner_id, password, started, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, isPrivate, ownerId, password || null, started, createdAt],
      (err) => {
        if (err) return console.error("Erro ao inserir torneio:", err.message);
        console.log(`🏆 Torneio ${id} inserido.`);
      }
    );

    const stmt = db.prepare(
      `INSERT OR IGNORE INTO tournament_players (tournament_id, player_id)
       VALUES (?, ?)`
    );

    for (const playerId of players) {
      stmt.run(id, playerId);
    }

    stmt.finalize((err) => {
      if (err) return console.error("Erro ao inserir jogadores:", err.message);
      console.log(`🎮 Jogadores inseridos no torneio ${id}.`);
    });
  });
});
