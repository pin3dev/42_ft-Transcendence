const db = require("./sqlite");
const util = require("util");

const run = util.promisify(db.run).bind(db);
const get = util.promisify(db.get).bind(db);

async function save(profile) {
  return run(`
    INSERT INTO user_profiles (user_id, name, avatar_url, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO NOTHING
  `, [profile.userId, profile.name, profile.avatarUrl, profile.updatedAt]);
}

async function nameExists(name) {
  const row = await get(`SELECT 1 FROM user_profiles WHERE name = ?`, [name]);
  return !!row;
}

async function findById(userId) {
  return await get("SELECT * FROM user_profiles WHERE user_id = ?", [userId]);
}

async function update(userId, { name, avatar_url }) {
  await run(`
    UPDATE user_profiles
    SET name = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `, [name, avatar_url, userId]);

  return await findById(userId);
}

async function deleteProfile(userId) {
  return run(`DELETE FROM user_profiles WHERE user_id = ?`, [userId]);
}

module.exports = {
  save,
  nameExists,
  findById,
  update,
  delete: deleteProfile,
};


