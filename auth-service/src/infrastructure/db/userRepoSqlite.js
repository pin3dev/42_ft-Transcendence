const db = require("./sqlite"); // Importa a instância do banco SQLite
const util = require("util"); // Usado para converter funções callback em promises

const get = util.promisify(db.get).bind(db); // Transforma db.get em uma função que retorna Promise
const run = util.promisify(db.run).bind(db); // Transforma db.run em uma função que retorna Promise

// Busca usuário por email no banco de dados

async function findByEmail(email) {
  return await get("SELECT * FROM users WHERE email = ?", [email]);
}

async function save(user) {
  return await new Promise((resolve, reject) => {
    db.run(
      //"INSERT INTO users (email, password) VALUES (?, ?)",
      //[user.email, user.passwordHash],
      "INSERT INTO users (email, password, twoFASecret) VALUES (?, ?, ?)",
      [user.email, user.passwordHash, user.twoFASecret],
      function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID });
      }
    );
  });
}

async function findById(id) {
  return await get("SELECT * FROM users WHERE id = ?", [id]);
}

module.exports = {
  findByEmail,
  save,
  findById // ← exporta a função nova
};