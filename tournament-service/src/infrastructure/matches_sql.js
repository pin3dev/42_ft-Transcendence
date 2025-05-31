const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbFolder = "/app/data";
const dbPath = path.join(dbFolder, "tournament.sqlite");

if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
  console.log("📁 Pasta 'data/' criada automaticamente.");
}

const db = new sqlite3.Database(dbPath);

// criação da tabela matches
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        tournament_id TEXT NOT NULL,
        player1_id TEXT NOT NULL,
        player2_id TEXT NOT NULL,
        winner_id TEXT NOT NULL,
        score TEXT NOT NULL,
        started_at DATETIME NOT NULL,
        ended_at DATETIME NOT NULL,
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
      )
    `);
  });
  
  module.exports = db;
  