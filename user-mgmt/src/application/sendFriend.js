const { findRelation, createRelation } = require("../infrastructure/db/friends_repository");
const profileRepo = require("../infrastructure/db/profile_repository");

async function sendFriend(user_id, target_id) {
  if (user_id === target_id) {
    throw new Error("Você não pode se adicionar como amigo.");
  }

  const targetExists = await profileRepo.findById(target_id);
  if (!targetExists) {
    const error = new Error("Usuário alvo não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  const existing = await findRelation(user_id, target_id);
  if (existing) {
    throw new Error("Já existe uma relação entre esses usuários.");
  }

  await createRelation(user_id, target_id);
}

module.exports = sendFriend;
