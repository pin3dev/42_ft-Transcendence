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
  // const rows = await db.all(sql, ids);
  const rows = await all(sql, ids); 
  return rows; // <--- ESSA LINHA PRECISA EXISTIR!
}

async function searchByName(name) {
  if (!name || name.length < 2) return [];

  const sql = `
    SELECT user_id, name, avatar_path
    FROM user_profiles
    WHERE name LIKE ?
    LIMIT 10
  `;
  const rows = await all(sql, [`%${name}%`]);

  const GATEWAY = Buffer.from(process.env.LOCAL_IP_BASE64, 'base64').toString('utf-8');

  return rows.map(p => ({
    user_id: String(p.user_id || p.USER_ID),
    name: p.name || p.NAME,
    avatar_url: `https://${GATEWAY}/static${p.avatar_path || p.AVATAR_PATH}`
  }));
}

module.exports = {
  save,
  nameExists,
  findById,
  update,
  delete: deleteProfile,
  findManyByIds,
  searchByName,
};


