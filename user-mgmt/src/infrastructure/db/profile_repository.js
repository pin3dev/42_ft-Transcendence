const db = require("./profile_sqlite");
const util = require("util");

const run = util.promisify(db.run).bind(db);
const get = util.promisify(db.get).bind(db);
const all = util.promisify(db.all).bind(db);


async function save(profile) {
  return run(`
    INSERT INTO user_profiles (user_id, name, avatar_path, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO NOTHING
  `, [profile.userId, profile.name, profile.avatarPath, profile.updatedAt]);
}

async function nameExists(name) {
  const row = await get(`SELECT 1 FROM user_profiles WHERE name = ?`, [name]);
  return !!row;
}

async function findById(userId) {
  return await get("SELECT * FROM user_profiles WHERE user_id = ?", [userId]);
}

async function update(userId, { name, avatar_path }) {
  await run(`
    UPDATE user_profiles
    SET name = ?, avatar_path = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `, [name, avatar_path, userId]);

  return await findById(userId);
}

async function deleteProfile(userId) {
  return run(`DELETE FROM user_profiles WHERE user_id = ?`, [userId]);
}


async function findManyByIds(ids) {
  if (!ids.length) return [];

  const placeholders = ids.map(() => '?').join(',');
  const sql = `SELECT user_id, name, avatar_path FROM user_profiles WHERE user_id IN (${placeholders})`;
  const rows = await db.all(sql, ids);
  return rows; // <--- ESSA LINHA PRECISA EXISTIR!
}

module.exports = {
  save,
  nameExists,
  findById,
  update,
  delete: deleteProfile,
  findManyByIds,
};


