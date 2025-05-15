const { findRelation, deleteRelation } = require("../infrastructure/db/friends_repository");

async function removeFriend(user_id, target_id) {
  const relation = await findRelation(user_id, target_id);

  if (!relation) {
    throw new Error("Relação de amizade não encontrada.");
  }

  if (relation.status !== "ACCEPTED") {
    throw new Error("Só é possível remover amizades aceitas.");
  }

  await deleteRelation(relation.user_id, relation.friend_id);
}

module.exports = removeFriend;
