
const sqlite3 = require("sqlite3").verbose(); 
const path = require("path"); 
const fs = require("fs"); 
const dbFolder = "/app/data"; 
const dbPath = path.join(dbFolder, "database.sqlite"); 

  if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
    console.log("📁 Pasta 'data/' criada automaticamente.");
  }
  
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      twoFASecret TEXT NOT NULL,
      first2FALoginDone BOOLEAN DEFAULT 0
    )
  `);
});

module.exports = db; 