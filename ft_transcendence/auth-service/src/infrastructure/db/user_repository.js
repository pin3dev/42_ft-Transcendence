const db = require("./user_sqlite"); 
const util = require("util"); 

const get = util.promisify(db.get).bind(db); 
const run = util.promisify(db.run).bind(db); 

async function findByEmail(email) {
  return await get("SELECT * FROM users WHERE email = ?", [email]);
}

async function save(user) {
  return await new Promise((resolve, reject) => {
    db.run(
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

async function deleteById(userId) {
  return run(`DELETE FROM users WHERE id = ?`, [userId]);
}

// Marca que o QR já foi entregue
async function markFirst2FALoginDone(userId) {
  return await run(
    "UPDATE users SET first2FALoginDone = 1 WHERE id = ?",
    [userId]
  );
}

module.exports = {
  findByEmail,
  save,
  findById,
  deleteById,
  markFirst2FALoginDone
};