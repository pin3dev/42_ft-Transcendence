const rejectFriend = require("../../application/rejectFriend");

async function rejectFriend_controller(request, reply) {
  const user_id = request.headers["x-user-id"];
  const { sender_id } = request.body;

  try {
    await rejectFriend(user_id, sender_id);
    // friend rejected metric
    request.server.metrics.friendshipRejected.inc();
    reply.code(200).send({ message: "Solicitação rejeitada com sucesso." });
  } catch (err) {
    // friend error metric
    request.server.metrics.friendshipError.inc();
    reply.code(400).send({ error: err.message });
  }
}

module.exports = { rejectFriend_controller };
