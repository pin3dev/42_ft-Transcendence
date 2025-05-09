const db = require("./sqlite"); 
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


module.exports = {
  findByEmail,
  save,
  findById,
  deleteById,
};