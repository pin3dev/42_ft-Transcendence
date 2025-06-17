const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbFolder = "/app/data";
const dbPath = path.join(dbFolder, "tournament.sqlite");

if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
  //console.logog("📁 Pasta 'data/' criada.");
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");

  db.run(`
    CREATE TABLE IF NOT EXISTS tournaments (
      id TEXT PRIMARY KEY,
      is_private BOOLEAN NOT NULL,
      owner_id TEXT NOT NULL,
      password TEXT,
      started DATETIME NOT NULL,
      ended DATETIME,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
