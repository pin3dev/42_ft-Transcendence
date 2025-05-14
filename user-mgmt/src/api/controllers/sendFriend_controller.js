const sendFriend = require("../../application/sendFriend");

async function sendFriend_controller(request, reply) {
  const { friendId } = request.body;
  const userId = request.headers["x-user-id"]; 

  try {
    await sendFriend(userId, friendId);
    reply.code(201).send({ message: "Solicitação enviada com sucesso." });
  } catch (err) {
    reply.code(400).send({ error: err.message });
  }
}

module.exports = { sendFriend_controller };

// const userId = request.headers["x-user-id"];
