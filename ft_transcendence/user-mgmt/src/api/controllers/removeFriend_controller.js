const removeFriend = require("../../application/removeFriend");

async function removeFriend_controller(request, reply) {
  const user_id = request.headers["x-user-id"];
  const { target_id } = request.body;

  try {
    await removeFriend(user_id, target_id);
    // friend rejected metric
    request.server.metrics.friendshipRejected.inc();
    reply.code(200).send({ message: "Amizade removida com sucesso." });
  } catch (err) {
    // friend error metric
    request.server.metrics.friendshipError.inc();
    reply.code(400).send({ error: err.message });
  }
}

module.exports = { removeFriend_controller };
