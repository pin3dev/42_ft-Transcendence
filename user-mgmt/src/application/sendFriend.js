const { findRelation, createRelation } = require("../infrastructure/db/friends_repository");

async function sendFriend(user_id, target_id) {
  if (user_id === target_id) {
    throw new Error("Você não pode se adicionar como amigo.");
  }

  const existing = await findRelation(user_id, target_id);
  if (existing) {
    throw new Error("Já existe uma relação entre esses usuários.");
  }

  await createRelation(user_id, target_id);
}

module.exports = sendFriend;
