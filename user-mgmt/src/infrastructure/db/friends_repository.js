const db = require("../db/friends_sqlite");
const util = require("util");

const run = util.promisify(db.run).bind(db);
const get = util.promisify(db.get).bind(db);

async function findRelation(userId, friendId) {
  return get(`
    SELECT * FROM friends
    WHERE (user_id = ? AND friend_id = ?)
       OR (user_id = ? AND friend_id = ?)
  `, [userId, friendId, friendId, userId]);
}

async function createRelation(userId, friendId) {
  return run(`
    INSERT INTO friends (user_id, friend_id, status)
    VALUES (?, ?, 'PENDING')
  `, [userId, friendId]);
}

module.exports = {
  findRelation,
  createRelation,
};
