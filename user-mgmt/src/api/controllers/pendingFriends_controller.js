const pendingFriends = require("../../application/pendingFriends");

async function pendingFriends_controller(request, reply) {
  const userId = request.headers["x-user-id"];

  try {
    const result = await pendingFriends(userId);
    reply.code(200).send(result);
  } catch (err) {
    reply.code(500).send({ error: "Erro ao buscar solicitações pendentes." });
  }
}

module.exports = { pendingFriends_controller };
