const sqlite3 = require("sqlite3").verbose(); 
const path = require("path"); 
const fs = require("fs"); 
const dbFolder = "/app/data";
const dbPath = path.join(dbFolder, "profiles.sqlite"); 

if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
  console.log("📁 Pasta 'data/' criada automaticamente.");
}
  
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      avatar_path TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
