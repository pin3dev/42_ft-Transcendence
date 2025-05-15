const { findRelation, updateStatus } = require("../infrastructure/db/friends_repository");

async function acceptFriend(user_id, sender_id) {
  const relation = await findRelation(sender_id, user_id);

  if (!relation) {
    throw new Error("Solicitação de amizade não encontrada.");
  }

  if (relation.status !== "PENDING") {
    throw new Error("A solicitação já foi processada.");
  }

  // Verifica se o usuário que está aceitando a solicitação é o destinatário
  if (relation.user_id !== sender_id || relation.friend_id !== user_id) {
    throw new Error("Você não pode aceitar uma solicitação que não foi enviada a você.");
  }

  await updateStatus(sender_id, user_id, "ACCEPTED");
}

module.exports = acceptFriend;
