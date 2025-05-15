// const { findRelation, updateStatus } = require("../infrastructure/db/friends_repository");

// async function rejectFriend(user_id, sender_id) {
//   const relation = await findRelation(sender_id, user_id);

//   if (!relation) {
//     throw new Error("Solicitação de amizade não encontrada.");
//   }

//   if (relation.status !== "PENDING") {
//     throw new Error("A solicitação já foi processada.");
//   }

//   if (relation.user_id !== sender_id || relation.friend_id !== user_id) {
//     throw new Error("Você só pode rejeitar solicitações enviadas para você.");
//   }

//   await updateStatus(sender_id, user_id, "REJECTED");
// }

// module.exports = rejectFriend;
