const db = require("../db/friends_sqlite");
const util = require("util");

const run = util.promisify(db.run).bind(db);
const get = util.promisify(db.get).bind(db);

async function findRelation(userId, target_id) {
  return get(`
    SELECT * FROM friends
    WHERE (user_id = ? AND friend_id = ?)
       OR (user_id = ? AND friend_id = ?)
  `, [userId, target_id, target_id, userId]);
}

async function createRelation(userId, target_id) {
  return run(`
    INSERT INTO friends (user_id, friend_id, status)
    VALUES (?, ?, 'PENDING')
  `, [userId, target_id]);
}

async function updateStatus(userId, target_id, newStatus) {
  return run(
    `
    UPDATE friends
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ? AND friend_id = ?
  `,
    [newStatus, userId, target_id]
  );
}

module.exports = {
  findRelation,
  createRelation,
  updateStatus,
};
