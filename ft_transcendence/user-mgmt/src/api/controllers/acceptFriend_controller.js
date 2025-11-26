const acceptFriend = require("../../application/acceptFriend");

async function acceptFriend_controller(request, reply) {
  const { sender_id } = request.body;
  const user_id = request.headers["x-user-id"];

  try {
    await acceptFriend(user_id, sender_id);
    // accepted friendship metrics
    request.server.metrics.friendshipAccepted.inc();
    reply.code(200).send({ message: "Amizade aceita com sucesso." });
  } catch (err) {
    // error friendship metrics
    request.server.metrics.friendshipError.inc();
    reply.code(400).send({ error: err.message });
  }
}

module.exports = { acceptFriend_controller };
