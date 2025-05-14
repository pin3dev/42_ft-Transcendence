const { findRelation, createRelation } = require("../infrastructure/db/friends_repository");

async function sendFriend(userId, friendId) {
  if (userId === friendId) {
    throw new Error("Você não pode se adicionar como amigo.");
  }

  const existing = await findRelation(userId, friendId);
  if (existing) {
    throw new Error("Já existe uma relação entre esses usuários.");
  }

  await createRelation(userId, friendId);
}

module.exports = sendFriend;
