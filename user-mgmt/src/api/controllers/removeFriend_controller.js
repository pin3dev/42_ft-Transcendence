const removeFriend = require("../../application/removeFriend");

async function removeFriend_controller(request, reply) {
  const user_id = request.headers["x-user-id"];
  const { target_id } = request.body;

  try {
    await removeFriend(user_id, target_id);
    reply.code(200).send({ message: "Amizade removida com sucesso." });
  } catch (err) {
    reply.code(400).send({ error: err.message });
  }
}

module.exports = { removeFriend_controller };
