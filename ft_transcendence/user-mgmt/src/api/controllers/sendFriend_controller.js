const sendFriend = require("../../application/sendFriend");

async function sendFriend_controller(request, reply) {
  const { target_id } = request.body;
  const user_id = request.headers["x-user-id"]; 

  try {
    await sendFriend(user_id, target_id);
    // friendship requested metric
    request.server.metrics.friendshipRequested.inc();
    reply.code(201).send({ message: "Solicitação enviada com sucesso." });
  } catch (err) {
    // friendship error metric
    request.server.metrics.friendshipError.inc();
    reply.code(400).send({ error: err.message });
  }
}

module.exports = { sendFriend_controller };
