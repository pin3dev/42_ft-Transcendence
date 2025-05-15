const { listAccepted } = require("../infrastructure/db/friends_repository");

async function getFriends(user_id) {
  const rows = await listAccepted(user_id);

  return rows.map(row => ({
    friend_id: row.user_id === user_id ? row.friend_id : row.user_id,
    since: row.updated_at,
  }));
}

module.exports = getFriends;
