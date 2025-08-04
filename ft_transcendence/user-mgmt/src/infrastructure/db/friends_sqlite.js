const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const dbFolder = "/app/data";
const dbPath = path.join(dbFolder, "profiles.sqlite"); // usa o mesmo banco

if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
  //console.logog("📁 Pasta 'data/' criada automaticamente.");
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS friends (
      user_id TEXT NOT NULL,
      friend_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, friend_id)
    )
  `, (err) => {
    if (!err) {
      //tratar erro melhor
      //console.logog("✅ Tabela 'friends' criada (ou já existia).");
    } else {
      console.error("❌ Erro ao criar tabela 'friends':", err.message);
    }
  });
});

module.exports = db;
