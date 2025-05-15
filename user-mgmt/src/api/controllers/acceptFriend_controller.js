const acceptFriend = require("../../application/acceptFriend");

async function acceptFriend_controller(request, reply) {
  const { sender_id } = request.body;
  const user_id = request.headers["x-user-id"];

  try {
    await acceptFriend(user_id, sender_id);
    reply.code(200).send({ message: "Amizade aceita com sucesso." });
  } catch (err) {
    reply.code(400).send({ error: err.message });
  }
}

module.exports = { acceptFriend_controller };
