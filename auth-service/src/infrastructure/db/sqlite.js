
const sqlite3 = require("sqlite3").verbose(); // SQLite com logs detalhados (verbose)
const path = require("path"); // Lib do Node para resolver caminhos de arquivos
const fs = require("fs"); // Módulo nativo para manipular arquivos
const dbFolder = "/app/data"; // caminho fixo dentro do container
const dbPath = path.join(dbFolder, "database.sqlite"); // Caminho do banco de dados

/*
   Essa parte do código é executada apenas uma vez
   no início do servidor
   Verifica se a pasta `data`, se o banco de dados e a tabela ´users´ existem
   Se não existirem, cria automaticamente
   E por fim, da acesso ao banco de dados pelo modulo db
   */


  //const dataDir = path.join(__dirname, "../data"); // Caminho da pasta que guardará o banco // para teste na maquina local
  
  // Se a pasta `data` não existir, cria automaticamente
  if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
    console.log("📁 Pasta 'data/' criada automaticamente.");
  }
  
// Cria ou abre o banco
const db = new sqlite3.Database(dbPath);
//const db = new sqlite3.Database(path.join(__dirname, "../data/database.sqlite")); // para teste na maquina local

// Cria a tabela 'users' se ela não existir
// id autoincrementa, email é único, senha obrigatória
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      twoFASecret TEXT NOT NULL
    )
  `);
});

module.exports = db; // Exporta a instância do banco para uso no repositório